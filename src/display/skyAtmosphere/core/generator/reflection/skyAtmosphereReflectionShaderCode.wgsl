@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outputTexture).xy;
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let clipPos = vec4<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, 1.0, 1.0);
    
    let worldPos = faceMatrices[face] * clipPos;
    var viewDir = normalize(worldPos.xyz);
    if (params.useGround < 0.5) { viewDir.y = abs(viewDir.y); }
    
    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);
    let tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        integrateSegment(rayOrigin, viewDir, 0.0, intersect.x, 16u, &radiance, &transmittance);
        if (params.useGround > 0.5) {
            let hitPos = rayOrigin + viewDir * intersect.x;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getSunTransmittanceManual(hitPos, params.sunDirection, params);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 1.0), 0.0).rgb;
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * (params.groundAlbedo * INV_PI);
        }
    } else if (tMax > 0.0) {
        integrateSegment(rayOrigin, viewDir, 0.0, tMax, 32u, &radiance, &transmittance);
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}

fn integrateSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let r = params.earthRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = phaseMieDual(viewSunCos, params.mieAnisotropy);
    let phaseF = phaseMie(viewSunCos, 0.7);

    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let h = pLen - r;
        if (params.useGround > 0.5 && h < -0.001) { continue; }

        let up = p / pLen;
        let cosSun = dot(up, sunDir);
        let sunTrans = getSunTransmittanceManual(p, sunDir, params);
        let shadowMask = select(1.0, 0.0, params.useGround > 0.5 && getRaySphereIntersection(p, sunDir, r) > 0.0);

        let rhoR = exp(-h / params.rayleighScaleHeight);
        let rhoM = exp(-h / params.mieScaleHeight);
        let rhoF = exp(-h * params.heightFogFalloff);
        let ozoneDist = abs(h - params.ozoneLayerCenter);
        let rhoO = exp(-max(0.0, ozoneDist * ozoneDist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));

        let scatR = params.rayleighScattering * rhoR;
        let scatM = vec3<f32>(params.mieScattering * rhoM);
        let scatF = vec3<f32>(params.heightFogDensity * rhoF);
        
        let msUV = vec2<f32>(cosSun * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
        let msScat = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (scatR + scatM + scatF) * shadowMask;

        let ext = scatR + vec3<f32>(params.mieExtinction * rhoM) + params.ozoneAbsorption * rhoO + scatF;

        *radiance += *transmittance * ((scatR * phaseR + scatM * phaseM + scatF * phaseF) * sunTrans * shadowMask + msScat) * stepSize;
        *transmittance *= exp(-ext * stepSize);
    }
}
