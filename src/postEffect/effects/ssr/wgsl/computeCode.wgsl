let screenCoord = vec2<i32>(global_id.xy);
    let texDims = textureDimensions(sourceTexture);
    let texSize = vec2<i32>(texDims);

    // 텍스처 범위 체크
    if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) {
        return;
    }

    // 원본 색상 읽기
    let originalColor = textureLoad(sourceTexture, screenCoord);

    // 모든 픽셀에 대해 처리 (깊이 검사 제거)
    let depth = textureLoad(depthTexture, screenCoord, 0);

    // 스카이박스나 배경은 원본 색상 그대로 사용
    if (depth >= 0.999) {
        textureStore(outputTexture, screenCoord, originalColor);
        return;
    }

    // 뷰 포지션과 노멀 복원
    let viewPos = reconstructViewPosition(screenCoord, depth);
    let viewNormal = reconstructViewNormal(screenCoord);

    // 노멀 유효성 검사 (더 관대하게)
    let normalLength = length(viewNormal);
    if (normalLength < 0.001) {
        textureStore(outputTexture, screenCoord, originalColor);
        return;
    }

    // 정규화된 노멀
    let normal = normalize(viewNormal);

    // 뷰 방향 벡터 (카메라에서 픽셀로)
    let viewDir = normalize(-viewPos);

    // 반사 벡터 계산
    let reflectDir = reflect(-viewDir, normal);

    // 프레넬 효과 계산 (더 관대한 조건)
    let NdotV = max(0.0, dot(normal, viewDir));
    let fresnel = pow(1.0 - NdotV, 1.5); // 지수를 낮춰서 더 많은 반사

    // 모든 표면에 대해 반사 처리 (조건 완화)
    let reflection = performRayMarching(viewPos, reflectDir);

    // 반사가 없어도 약간의 환경 반사 추가
    var reflectionColor = vec3<f32>(0.0);
    var reflectionAlpha = 0.0;

    if (reflection.a > 0.001) {
        reflectionColor = reflection.rgb;
        reflectionAlpha = reflection.a;
    } else {
        // 반사를 찾지 못한 경우 환경 색상 사용
        reflectionColor = originalColor.rgb * 0.1; // 약간의 환경 반사
        reflectionAlpha = 0.05;
    }

    // 재질별 반사율 추정
    let materialReflectance = max(0.02, estimateMaterialReflectance(originalColor.rgb));

    // 프레넬과 재질 반사율 결합 (더 강한 반사)
    let F0 = materialReflectance;
    let fresnelReflectance = F0 + (1.0 - F0) * fresnel;

    // 반사 강도 계산 (더 강하게)
    let baseReflectionStrength = reflectionAlpha * uniforms.reflectionIntensity * 1.5;
    let reflectionStrength = baseReflectionStrength * fresnelReflectance;
    let finalReflectionColor = reflectionColor * reflectionStrength;

    // 물리적으로 정확한 색상 혼합
    let kS = min(0.8, fresnelReflectance); // 최대 반사율 증가
    let kD = 1.0 - kS;

    let diffuseColor = originalColor.rgb * kD;
    var finalColor = diffuseColor + finalReflectionColor;

    // 밝기 정규화 (더 관대하게)
    let maxComponent = max(max(finalColor.r, finalColor.g), finalColor.b);
    if (maxComponent > 1.2) { // 임계값을 높여서 더 밝은 반사 허용
        finalColor = finalColor / maxComponent;
    }

    // 최종 결과 저장 (모든 픽셀 처리)
    textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
