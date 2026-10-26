#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(1) var aerialPerspectiveLUT: texture_storage_3d<rgba16float, write>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(13) var skyAtmosphereSampler: sampler;

/**
 * [KO] 카메라 절두체 공간의 깊이 슬라이스별 대기 산란광과 평균 투과율을 3D LUT에 계산하여 저장합니다.
 * [EN] Computes and stores per-depth-slice atmospheric scattered light and average transmittance in camera frustum space into a 3D LUT.
 */
@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(aerialPerspectiveLUT);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);

    // [KO] NDC 좌표와 역투영·역뷰 행렬을 이용해 월드 공간 광선 방향을 복원합니다.
    // [EN] Reconstruct the world-space ray direction from NDC coordinates and inverse projection/view matrices.
    let invP = systemUniforms.projection.inverseProjectionMatrix;
    let invV = systemUniforms.camera.inverseViewMatrix;
    let ndc = vec2<f32>(uvw.x * 2.0 - 1.0, (1.0 - uvw.y) * 2.0 - 1.0);
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    let viewDir = normalize(worldRotation * vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));

    // [KO] 근거리 정밀도 확보를 위해 Z축 슬라이스를 제곱 분포 거리로 매핑합니다.
    // [EN] Map the Z-axis slice to a squared distance distribution for higher near-field precision.
    let sliceDist = uvw.z * uvw.z * params.aerialPerspectiveDistanceScale; 

    let groundRadius = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, groundRadius);
    let tMax = select(sliceDist, min(sliceDist, tEarth), groundRadius > 0.0 && tEarth > 0.0);

    // [KO] 슬라이스 거리까지의 대기 산란과 전방 미 산란 광륜(Mie Glow)을 적분합니다.
    // [EN] Integrate atmospheric scattering and forward Mie glow up to the slice distance.
    if (tMax > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, AP_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, &radiance, &transmittance);

        let viewSunCos = dot(viewDir, params.sunDirection);
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transmittance);
        radiance += mieGlow;
    }

    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) * (1.0 / 3.0);
    textureStore(aerialPerspectiveLUT, global_id, vec4<f32>(radiance, avgTrans));
}
