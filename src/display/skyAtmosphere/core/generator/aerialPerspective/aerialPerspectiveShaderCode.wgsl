#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(1) var aerialPerspectiveLUT: texture_storage_3d<rgba16float, write>;
@group(0) @binding(2) var multiScatLUT: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(13) var skyAtmosphereSampler: sampler;

@compute @workgroup_size(8, 8, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    // [KO] 1. 인덱스 및 정규화된 UVW 좌표 계산 (3D LUT)
    // [EN] 1. Index and normalized UVW coordinate calculation (3D LUT)
    let size = textureDimensions(aerialPerspectiveLUT);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);

    // [KO] 2. 카메라 방향 및 슬라이스 거리 산출
    // [EN] 2. Deriving camera direction and slice distance
    let invP = systemUniforms.projection.inverseProjectionMatrix;
    let invV = systemUniforms.camera.inverseViewMatrix;
    let ndc = vec2<f32>(uvw.x * 2.0 - 1.0, (1.0 - uvw.y) * 2.0 - 1.0);
    let viewSpaceDir = normalize(vec3<f32>(ndc.x * invP[0][0], ndc.y * invP[1][1], -1.0));
    let worldRotation = mat3x3<f32>(invV[0].xyz, invV[1].xyz, invV[2].xyz);
    let viewDir = normalize(worldRotation * viewSpaceDir);

    // Z축(depth) 매핑: 제곱 스케일을 사용하여 근거리 정밀도 확보
    let sliceDist = uvw.z * uvw.z * params.aerialPerspectiveDistanceScale; 

    let groundRadius = params.groundRadius;
    let viewHeight = max(0.0, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 3. 특정 거리(Slice)까지의 산란광 적분
    // [EN] 3. Integrate scattered light up to a specific distance (Slice)
    let tEarth = getRaySphereIntersection(rayOrigin, viewDir, groundRadius);
    let tMax = select(sliceDist, min(sliceDist, tEarth), groundRadius > 0.0 && tEarth > 0.0);

    if (tMax > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, AP_STEPS, params, transmittanceLUT, skyAtmosphereSampler, multiScatLUT, true, &radiance, &transmittance);

        // [KO] 미 산란 글로우(Mie Glow) 추가: 태양 주변의 대기 산란 광채 표현
        // [EN] Add Mie Glow: Represent atmospheric scattering bloom around the sun
        let sunDir = normalize(params.sunDirection);
        let viewSunCos = dot(viewDir, sunDir);
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, params, transmittanceLUT, skyAtmosphereSampler, transmittance, 0.0);
        radiance += mieGlow;
    }

    // [KO] 4. 3D LUT에 최종 저장 (Alpha 채널에는 평균 투과율 보관)
    // [EN] 4. Final storage in 3D LUT (Average transmittance stored in Alpha channel)
    let avgTrans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(aerialPerspectiveLUT, global_id, vec4<f32>(radiance, avgTrans));
}