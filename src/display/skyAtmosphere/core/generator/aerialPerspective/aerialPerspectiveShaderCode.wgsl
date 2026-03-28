// [KO] Frustum-Aligned Aerial Perspective 3D LUT 생성을 위한 Compute Shader
#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(1) var aerialPerspectiveLUT: texture_storage_3d<rgba16float, write>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(13) var skyAtmosphereSampler: sampler;

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(aerialPerspectiveLUT);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    let invP = systemUniforms.projection.inverseProjectionMatrix;
    let invV = systemUniforms.camera.inverseViewMatrix;
    let ndc = vec2<f32>(uvw.x * 2.0 - 1.0, (1.0 - uvw.y) * 2.0 - 1.0);
    let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    let viewDir = normalize(worldRotation * viewSpaceDir);
    let sliceDist = uvw.z * uvw.z * params.aerialPerspectiveDistanceScale; 

    let groundRadius = params.groundRadius;
    let viewHeight = params.cameraHeight;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, groundRadius);

    if (sliceDist > 0.0) {
        if (intersect.x > 0.0) {
            let tEnd = min(sliceDist, intersect.x);
            integrateScatSegment(rayOrigin, viewDir, 0.0, tEnd, AP_STEPS / 2u, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);
        } else {
            integrateScatSegment(rayOrigin, viewDir, 0.0, sliceDist, AP_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);
        }
    }

    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(aerialPerspectiveLUT, global_id, vec4<f32>(radiance, avgTrans));
}
