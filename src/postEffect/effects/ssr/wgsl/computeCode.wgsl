let screenCoord = vec2<i32>(global_id.xy);
    let texDims = textureDimensions(sourceTexture);
    let texSize = vec2<i32>(texDims);

    if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) {
        return;
    }

    let originalColor = textureLoad(sourceTexture, screenCoord);
    let depth = textureLoad(depthTexture, screenCoord, 0);

    if (depth >= 0.999) {
        textureStore(outputTexture, screenCoord, originalColor);
        return;
    }

    let viewPos = reconstructViewPosition(screenCoord, depth);
    let viewNormal = reconstructViewNormal(screenCoord);

    let normalLength = length(viewNormal);
    if (normalLength < 0.1) {
        textureStore(outputTexture, screenCoord, originalColor);
        return;
    }

    let normal = normalize(viewNormal);
    let viewDir = normalize(-viewPos);

    let NdotV = dot(normal, viewDir);

    // 뒷면이나 너무 기울어진 표면은 반사하지 않음
    if (NdotV < 0.1) {
        textureStore(outputTexture, screenCoord, originalColor);
        return;
    }

    // 올바른 반사 벡터 계산
    // reflect(-I, N) = -I + 2.0 * dot(N, I) * N
    let reflectDir = reflect(-viewDir, normal);

    // 반사 방향 검증: 물 표면에서는 위쪽 객체가 아래쪽으로 반사되어야 함
    // 평평한 수면(normal이 (0,1,0))에서 위쪽 물체는 아래쪽으로 반사

    let reflection = performRayMarching(viewPos, reflectDir);

    var reflectionColor = vec3<f32>(0.0);
    var reflectionAlpha = 0.0;

    if (reflection.a > 0.001) {
        reflectionColor = reflection.rgb;
        reflectionAlpha = reflection.a;
    }

    let materialReflectance = estimateMaterialReflectance(originalColor.rgb);
    let F0 = max(0.04, materialReflectance);
    let fresnel = pow(1.0 - NdotV, 2.0);
    let fresnelReflectance = F0 + (1.0 - F0) * fresnel;

    let reflectionStrength = reflectionAlpha * uniforms.reflectionIntensity * fresnelReflectance;
    let finalReflectionColor = reflectionColor * reflectionStrength;

    let kS = fresnelReflectance;
    let kD = 1.0 - kS;

    let diffuseColor = originalColor.rgb * kD;
    var finalColor = diffuseColor + finalReflectionColor;

    let maxComponent = max(max(finalColor.r, finalColor.g), finalColor.b);
    if (maxComponent > 1.0) {
        finalColor = finalColor / (1.0 + maxComponent);
    }

    textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
