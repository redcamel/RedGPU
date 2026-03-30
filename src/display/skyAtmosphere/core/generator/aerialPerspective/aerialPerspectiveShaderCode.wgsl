// [KO] Frustum-Aligned Aerial Perspective 3D LUT 생성을 위한 Compute Shader (UE5 스타일)
#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(1) var aerialPerspectiveLUT: texture_storage_3d<rgba16float, write>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(13) var skyAtmosphereSampler: sampler;

@compute @workgroup_size(8, 8, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(aerialPerspectiveLUT);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    
    // [KO] 프러스텀 레이 방향 계산
    // [EN] Calculate frustum ray direction
    let invP = systemUniforms.projection.inverseProjectionMatrix;
    let invV = systemUniforms.camera.inverseViewMatrix;
    let ndc = vec2<f32>(uvw.x * 2.0 - 1.0, (1.0 - uvw.y) * 2.0 - 1.0);
    let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    let viewDir = normalize(worldRotation * viewSpaceDir);

    // [KO] UE5 스타일의 깊이 슬라이스 매핑: 카메라 근처에 더 많은 샘플을 배분
    // [EN] UE5 style depth slice mapping: distribute more samples near the camera
    let sliceDist = uvw.z * uvw.z * params.aerialPerspectiveDistanceScale; 

    let groundRadius = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 지면 오클루전 확인
    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, groundRadius);
    let tMax = select(sliceDist, min(sliceDist, tEarth), groundRadius > 0.0 && tEarth > 0.0);

    if (tMax > 0.0) {
        // [KO] 단일 산란 및 다중 산란 적분
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, AP_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);
        
        // [KO] 하이브리드 Mie Glow 보강 (UE5 스타일)
        // [KO] 볼륨 내에서도 태양 방향의 날카로운 Mie 성분을 추가하여 씬의 깊이감을 더함
        let sunDir = normalize(params.sunDirection);
        let viewSunCos = dot(viewDir, sunDir);
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transmittance, 0.0);
        radiance += mieGlow;
    }

    // [KO] 알파 채널에 평균 투과율 저장 (UE5 표준)
    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(aerialPerspectiveLUT, global_id, vec4<f32>(radiance, avgTrans));
}
