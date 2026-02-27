// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

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
    let maxDist = 100.0;
    let sliceDist = uvw.z * uvw.z * maxDist; 

    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    if (sliceDist > 0.0) {
        if (intersect.x > 0.0) {
            let tFrontEnd = min(sliceDist, intersect.x);
            integrateScatSegment(rayOrigin, viewDir, 0.0, tFrontEnd, 16u, &radiance, &transmittance);

            if (params.useGround < 0.5 && sliceDist > intersect.y && intersect.y > 0.0) {
                integrateScatSegment(rayOrigin, viewDir, intersect.y, sliceDist, 16u, &radiance, &transmittance);
            }
        } else {
            integrateScatSegment(rayOrigin, viewDir, 0.0, sliceDist, 32u, &radiance, &transmittance);
        }
    }

    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, avgTrans));
}
