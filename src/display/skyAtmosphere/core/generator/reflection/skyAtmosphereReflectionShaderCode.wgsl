@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

fn integrateScatSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let stepSize = (tMax - tMin) / f32(steps);
    for (var i = 0u; i < steps; i = i + 1u) {
        let t = tMin + (f32(i) + 0.5) * stepSize;
        let p = origin + dir * t;
        let r = params.earthRadius;
        let h = length(p) - r;
        
        if (params.useGround > 0.5 && h < -0.001) { continue; }

        let sunTrans = getPhysicalTransmittance(p, params.sunDirection, r, params.atmosphereHeight, params);
        let d = getAtmosphereDensities(h, params);
        let c = getAtmosphereCoefficients(d, params);
        
        var shadowMask = 1.0;
        if (params.useGround > 0.5 && getRaySphereIntersection(p, params.sunDirection, r) > 0.0) { shadowMask = 0.0; }

        let viewSunCos = dot(dir, params.sunDirection);
        let phase = c.scatR * phaseRayleigh(viewSunCos) + c.scatM * phaseMie(viewSunCos, params.mieAnisotropy) + c.scatF * phaseMie(viewSunCos, 0.7);
        
        let msUV = vec2<f32>(dot(p/length(p), params.sunDirection) * 0.5 + 0.5, 1.0 - clamp(h / params.atmosphereHeight, 0.0, 1.0));
        let msScat = textureSampleLevel(multiScatTexture, atmosphereSampler, msUV, 0.0).rgb * (c.scatR + c.scatM + c.scatF);

        *radiance += *transmittance * (phase * sunTrans * shadowMask + msScat * shadowMask) * stepSize;
        *transmittance *= exp(-c.extinction * stepSize);
    }
}

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
    var distLimit = select(tMax, intersect.x, params.useGround > 0.5 && intersect.x > 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (distLimit > 0.0) {
        if (intersect.x > 0.0) {
            integrateScatSegment(rayOrigin, viewDir, 0.0, intersect.x, 16u, &radiance, &transmittance);

            if (params.useGround > 0.5 && params.showGround > 0.5) {
                let hitPos = rayOrigin + viewDir * intersect.x;
                let up = normalize(hitPos);
                let cosSun = dot(up, params.sunDirection);
                let sunTrans = getPhysicalTransmittance(hitPos, params.sunDirection, r, params.atmosphereHeight, params);
                let albedo = params.groundAlbedo * INV_PI;
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 0.0), 0.0).rgb;
                radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * albedo;
            } else if (intersect.y > 0.0 && distLimit > intersect.y) {
                integrateScatSegment(rayOrigin, viewDir, intersect.y, distLimit, 16u, &radiance, &transmittance);
            }
        } else {
            integrateScatSegment(rayOrigin, viewDir, 0.0, distLimit, 32u, &radiance, &transmittance);
        }
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
