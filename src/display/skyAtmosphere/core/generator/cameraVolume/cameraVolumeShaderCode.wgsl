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
            // --- Segment 1: Camera to Earth (Front Atmosphere) ---
            let tFrontEnd = min(sliceDist, intersect.x);
            integrateScatSegment(rayOrigin, viewDir, 0.0, tFrontEnd, 16u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);

            if (params.useGround < 0.5 && sliceDist > intersect.y && intersect.y > 0.0) {
                // --- Segment 2: Earth Exit to Slice Dist (Back Atmosphere) ---
                integrateScatSegment(rayOrigin, viewDir, intersect.y, sliceDist, 16u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);
            }
        } else {
            // --- Single Segment: Standard Sky Path ---
            integrateScatSegment(rayOrigin, viewDir, 0.0, sliceDist, 32u, params, multiScatTexture, atmosphereSampler, &radiance, &transmittance);
        }
    }

    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, avgTrans));
}
