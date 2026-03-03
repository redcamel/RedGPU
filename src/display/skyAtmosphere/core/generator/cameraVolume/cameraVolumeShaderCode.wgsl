// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;

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
    let rayOrigin = vec3<f32>(0.0, params.cameraHeight + r, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    if (sliceDist > 0.0) {
        if (intersect.x > 0.0) {
            let tEnd = min(sliceDist, intersect.x);
            // [KO] 공용 적분 함수 호출 (수동 투과율 계산 모드)
            integrateScatSegment(rayOrigin, viewDir, 0.0, tEnd, 16u, params, transmittanceTexture, atmosphereSampler, multiScatTexture, false, &radiance, &transmittance);
            if (params.showGround < 0.5 && sliceDist > intersect.y && intersect.y > 0.0) {
                integrateScatSegment(rayOrigin, viewDir, intersect.y, sliceDist, 16u, params, transmittanceTexture, atmosphereSampler, multiScatTexture, false, &radiance, &transmittance);
            }
        } else {
            integrateScatSegment(rayOrigin, viewDir, 0.0, sliceDist, 32u, params, transmittanceTexture, atmosphereSampler, multiScatTexture, false, &radiance, &transmittance);
        }
    }

    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
