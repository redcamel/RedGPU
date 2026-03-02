// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(cameraVolumeTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    let azimuth = (uvw.x - 0.5) * 2.0 * PI;
    let elevation = (uvw.y - 0.5) * PI;
    
    var effectiveElevation = elevation;
    if (params.useGround < 0.5) { effectiveElevation = abs(elevation); }
    
    let viewDir = vec3<f32>(cos(effectiveElevation) * cos(azimuth), sin(effectiveElevation), cos(effectiveElevation) * sin(azimuth));
    let sliceDist = uvw.z * uvw.z * 100.0; 

    let r = params.earthRadius;
    let rayOrigin = vec3<f32>(0.0, max(0.0001, params.cameraHeight) + r, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    if (sliceDist > 0.0) {
        if (intersect.x > 0.0) {
            let tEnd = min(sliceDist, intersect.x);
            integrateSegment(rayOrigin, viewDir, 0.0, tEnd, 16u, &radiance, &transmittance);
            if (params.showGround < 0.5 && sliceDist > intersect.y && intersect.y > 0.0) {
                integrateSegment(rayOrigin, viewDir, intersect.y, sliceDist, 16u, &radiance, &transmittance);
            }
        } else {
            integrateSegment(rayOrigin, viewDir, 0.0, sliceDist, 32u, &radiance, &transmittance);
        }
    }

    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}

fn integrateSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let r = params.earthRadius;
    let stepSize = (tMax - tMin) / f32(steps);
    let sunDir = params.sunDirection;
    let viewSunCos = dot(dir, sunDir);
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = phaseMie(viewSunCos, params.mieAnisotropy);
    let phaseF = phaseMie(viewSunCos, 0.7);

    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let h = pLen - r;
        if (params.useGround > 0.5 && h < -0.001) { continue; }

        let up = p / pLen;
        let cosSun = dot(up, sunDir);
        let sunTrans = getSunTransmittanceManual(p, sunDir, params); // AP LUT는 지면 관통 시 정밀도가 중요하므로 수동 적분 유지
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
