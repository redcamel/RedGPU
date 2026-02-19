#redgpu_include math.direction.getReflectionVectorFromViewDirection
#redgpu_include math.getIsFinite
#redgpu_include math.EPSILON

/**
 * [KO] 굴절 및 투과 효과를 위해 배경(RenderPath1) 데이터를 샘플링하여 최종 투과 굴절 색상을 계산합니다.
 * [EN] Samples background (RenderPath1) data to calculate the final transmission refraction color.
 *
 * [KO] 이 함수는 KHR_materials_transmission 및 volume 확장을 지원하며, 분산(Dispersion) 및 두께에 따른 굴절 왜곡을 시뮬레이션합니다.
 * [EN] This function supports KHR_materials_transmission and volume extensions, simulating refractive distortion based on dispersion and thickness.
 *
 * @param u_useKHR_materials_volume - [KO] 볼륨 효과 사용 여부 [EN] Whether to use volume effects
 * @param thicknessParameter - [KO] 투과 두께 [EN] Transmission thickness
 * @param u_KHR_dispersion - [KO] 분산 계수 [EN] Dispersion coefficient
 * @param u_KHR_attenuationDistance - [KO] 감쇄 거리 [EN] Attenuation distance
 * @param u_KHR_attenuationColor - [KO] 감쇄 색상 [EN] Attenuation color
 * @param ior - [KO] 굴절률 [EN] Index of Refraction
 * @param roughnessParameter - [KO] 거칠기 계수 [EN] Roughness parameter
 * @param albedo - [KO] 알베도 색상 [EN] Albedo color
 * @param projectionCameraMatrix - [KO] 투영-카메라 행렬 [EN] Projection-Camera matrix
 * @param input_vertexPosition - [KO] 월드 공간의 버텍스 위치 [EN] Vertex position in world space
 * @param input_ndcPosition - [KO] NDC 공간의 위치 (미사용) [EN] Position in NDC space (Unused)
 * @param V - [KO] 시선 방향 벡터 [EN] View direction vector
 * @param N - [KO] 법선 벡터 [EN] Normal vector
 * @param renderPath1ResultTexture - [KO] 배경 텍스처 [EN] Background texture
 * @param renderPath1ResultTextureSampler - [KO] 배경 샘플러 [EN] Background sampler
 * @returns [KO] 계산된 최종 투과 굴절 색상 [EN] Calculated final transmission refraction color
 */
fn getTransmissionRefraction(
    u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
    ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
    projectionCameraMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
    V:vec3<f32>, N:vec3<f32>,
    renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
) -> vec3<f32> {
    var transmissionRefraction = vec3<f32>(0.0);

    // Mip Level 안전 범위 설정
    let maxMipLevel = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let transmissionMipLevel = clamp(roughnessParameter * maxMipLevel, 0.0, maxMipLevel);

    if(u_useKHR_materials_volume){
        var iorR: f32 = ior;
        var iorG: f32 = ior;
        var iorB: f32 = ior;

        if(u_KHR_dispersion > 0.0){
            let halfSpread: f32 = (ior - 1.0) * 0.025 * u_KHR_dispersion;
            iorR = ior + halfSpread;
            iorG = ior;
            iorB = ior - halfSpread;
        }

        // IOR 값 안전 범위 제한 (1.0 이상)
        iorR = max(iorR, 1.0 + EPSILON);
        iorG = max(iorG, 1.0 + EPSILON);
        iorB = max(iorB, 1.0 + EPSILON);

        // 굴절 벡터 계산
        let refractedVecR: vec3<f32> = refract(-V, N, 1.0 / iorR);
        let refractedVecG: vec3<f32> = refract(-V, N, 1.0 / iorG);
        let refractedVecB: vec3<f32> = refract(-V, N, 1.0 / iorB);

        // 전반사 체크 (굴절 벡터가 0인 경우 반사 사용)
        let validR = dot(refractedVecR, refractedVecR) > 0.0;
        let validG = dot(refractedVecG, refractedVecG) > 0.0;
        let validB = dot(refractedVecB, refractedVecB) > 0.0;

        let R = getReflectionVectorFromViewDirection(V, N);
        let finalRefractR = select(R, refractedVecR, validR);
        let finalRefractG = select(R, refractedVecG, validG);
        let finalRefractB = select(R, refractedVecB, validB);

        // 안전한 thickness 범위 제한
        let safeThickness = clamp(thicknessParameter, 0.0, 100.0);

        // 각각의 굴절 벡터로 세계 좌표의 굴절 위치 계산
        let worldPosR: vec3<f32> = input_vertexPosition + finalRefractR * safeThickness;
        let worldPosG: vec3<f32> = input_vertexPosition + finalRefractG * safeThickness;
        let worldPosB: vec3<f32> = input_vertexPosition + finalRefractB * safeThickness;

        // 월드→뷰→프로젝션 변환 적용하여 최종 UV 좌표 계산
        let clipPosR: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosR, 1.0);
        let clipPosG: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosG, 1.0);
        let clipPosB: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosB, 1.0);

        // 0으로 나누기 방지
        let wR = max(abs(clipPosR.w), EPSILON);
        let wG = max(abs(clipPosG.w), EPSILON);
        let wB = max(abs(clipPosB.w), EPSILON);

        let ndcR: vec2<f32> = clipPosR.xy / wR * 0.5 + 0.5;
        let ndcG: vec2<f32> = clipPosG.xy / wG * 0.5 + 0.5;
        let ndcB: vec2<f32> = clipPosB.xy / wB * 0.5 + 0.5;

        // Y축 좌표 변환 적용 및 UV 범위 제한
        let finalUV_R: vec2<f32> = clamp(vec2<f32>(ndcR.x, 1.0 - ndcR.y), vec2<f32>(0.0), vec2<f32>(1.0));
        let finalUV_G: vec2<f32> = clamp(vec2<f32>(ndcG.x, 1.0 - ndcG.y), vec2<f32>(0.0), vec2<f32>(1.0));
        let finalUV_B: vec2<f32> = clamp(vec2<f32>(ndcB.x, 1.0 - ndcB.y), vec2<f32>(0.0), vec2<f32>(1.0));

        // RGB 픽셀 샘플링
        let sampledR = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
        let sampledG = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
        let sampledB = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;

        // NaN/Inf 방지
        transmissionRefraction.r = select(0.0, sampledR, getIsFiniteScalar(sampledR));
        transmissionRefraction.g = select(0.0, sampledG, getIsFiniteScalar(sampledG));
        transmissionRefraction.b = select(0.0, sampledB, getIsFiniteScalar(sampledB));

    } else {
        // IOR 값 안전 범위 제한
        let safeIor = max(ior, 1.0 + EPSILON);

        let refractedVec: vec3<f32> = refract(-V, N, 1.0 / safeIor);

        // 전반사 체크
        let valid = dot(refractedVec, refractedVec) > 0.0;
        let R = getReflectionVectorFromViewDirection(V, N);
        let finalRefract = select(R, refractedVec, valid);

        // 안전한 thickness 범위 제한
        let safeThickness = clamp(thicknessParameter, 0.0, 100.0);

        let worldPos: vec3<f32> = input_vertexPosition + finalRefract * safeThickness;
        let clipPos: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);

        // 0으로 나누기 방지
        let w = max(abs(clipPos.w), EPSILON);
        let ndc: vec2<f32> = clipPos.xy / w * 0.5 + 0.5;

        // UV 범위 제한
        let finalUV: vec2<f32> = clamp(vec2<f32>(ndc.x, 1.0 - ndc.y), vec2<f32>(0.0), vec2<f32>(1.0));

        let sampled = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;

        // NaN/Inf 방지
        transmissionRefraction = select(vec3<f32>(0.0), sampled, all(getIsFiniteVec3(sampled)));
    }

    // 투과 색상에 알베도 적용 (안전한 범위로 제한)
    let safeAlbedo = clamp(albedo, vec3<f32>(0.0), vec3<f32>(1.0));
    transmissionRefraction *= safeAlbedo;

    // 최종 결과 안전성 체크
    transmissionRefraction = select(vec3<f32>(0.0), transmissionRefraction, all(getIsFiniteVec3(transmissionRefraction)));

    return transmissionRefraction;
}
