#redgpu_include math.getReflectionVectorFromViewDirection

fn calcPrePathBackground(
    u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
    ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
    projectionCameraMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
    V:vec3<f32>, N:vec3<f32>,
    renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
) -> vec3<f32> {
    var prePathBackground = vec3<f32>(0.0);

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
        iorR = max(iorR, 1.0001);
        iorG = max(iorG, 1.0001);
        iorB = max(iorB, 1.0001);

        // 굴절 벡터 계산
        let refractedVecR: vec3<f32> = refract(-V, N, 1.0 / iorR);
        let refractedVecG: vec3<f32> = refract(-V, N, 1.0 / iorG);
        let refractedVecB: vec3<f32> = refract(-V, N, 1.0 / iorB);

        // 전반사 체크 (굴절 벡터가 0인 경우 반사 사용)
        let validR = dot(refractedVecR, refractedVecR) > 0.0;
        let validG = dot(refractedVecG, refractedVecG) > 0.0;
        let validB = dot(refractedVecB, refractedVecB) > 0.0;

        let finalRefractR = select(getReflectionVectorFromViewDirection(V, N), refractedVecR, validR);
        let finalRefractG = select(getReflectionVectorFromViewDirection(V, N), refractedVecG, validG);
        let finalRefractB = select(getReflectionVectorFromViewDirection(V, N), refractedVecB, validB);

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
        let wR = max(abs(clipPosR.w), 0.0001);
        let wG = max(abs(clipPosG.w), 0.0001);
        let wB = max(abs(clipPosB.w), 0.0001);

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
        prePathBackground.r = select(0.0, sampledR, isFiniteScalar(sampledR));
        prePathBackground.g = select(0.0, sampledG, isFiniteScalar(sampledG));
        prePathBackground.b = select(0.0, sampledB, isFiniteScalar(sampledB));

    } else {
        // IOR 값 안전 범위 제한
        let safeIor = max(ior, 1.0001);

        let refractedVec: vec3<f32> = refract(-V, N, 1.0 / safeIor);

        // 전반사 체크
        let valid = dot(refractedVec, refractedVec) > 0.0;
        let finalRefract = select(getReflectionVectorFromViewDirection(V, N), refractedVec, valid);

        // 안전한 thickness 범위 제한
        let safeThickness = clamp(thicknessParameter, 0.0, 100.0);

        let worldPos: vec3<f32> = input_vertexPosition + finalRefract * safeThickness;
        let clipPos: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);

        // 0으로 나누기 방지
        let w = max(abs(clipPos.w), 0.0001);
        let ndc: vec2<f32> = clipPos.xy / w * 0.5 + 0.5;

        // UV 범위 제한
        let finalUV: vec2<f32> = clamp(vec2<f32>(ndc.x, 1.0 - ndc.y), vec2<f32>(0.0), vec2<f32>(1.0));

        let sampled = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;

        // NaN/Inf 방지
        prePathBackground = select(vec3<f32>(0.0), sampled, all(isFiniteVec3(sampled)));
    }

    // 투과 색상에 알베도 적용 (안전한 범위로 제한)
    let safeAlbedo = clamp(albedo, vec3<f32>(0.0), vec3<f32>(1.0));
    prePathBackground *= safeAlbedo;

    // 최종 결과 안전성 체크
    prePathBackground = select(vec3<f32>(0.0), prePathBackground, all(isFiniteVec3(prePathBackground)));

    return prePathBackground;
}

// isFinite 헬퍼 함수 (NaN과 Inf 체크)
fn isFiniteScalar(x: f32) -> bool {
    // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
    return x == x && abs(x) < 1e30;
}

fn isFiniteVec3(v: vec3<f32>) -> vec3<bool> {
    return vec3<bool>(
        v.x == v.x && abs(v.x) < 1e30,
        v.y == v.y && abs(v.y) < 1e30,
        v.z == v.z && abs(v.z) < 1e30
    );
}