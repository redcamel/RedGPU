// 메인 함수 코드 (Hi-Z Ray Tracing 사용)
let screenCoord = vec2<i32>(global_id.xy);
let texDims = textureDimensions(sourceTexture);
let texSize = vec2<i32>(texDims);

// 텍스처 범위 체크
if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) {
    return;
}

// 원본 색상 읽기
let originalColor = textureLoad(sourceTexture, screenCoord);

// 깊이 읽기
let depth = textureLoad(depthTexture, screenCoord, 0);

// 스카이박스나 먼 거리 오브젝트는 반사 없음
if (depth >= 0.999) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 뷰 포지션과 노멀 복원
let viewPos = reconstructViewPosition(screenCoord, depth);
let viewNormal = reconstructViewNormal(screenCoord);

// 노멀 유효성 검사
let normalLength = length(viewNormal);
if (normalLength < 0.01) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 정규화된 노멀
let normal = normalize(viewNormal);

// 뷰 방향 벡터 (카메라에서 픽셀로)
let viewDir = normalize(-viewPos);

// 반사 벡터 계산
let reflectDir = reflect(-viewDir, normal);

// 프레넬 효과 계산
let NdotV = max(0.001, dot(normal, viewDir));
let fresnel = pow(1.0 - NdotV, 2.0);

// 반사면 조건 체크
if (NdotV < 0.0001) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 반사 방향 체크
let reflectDotView = dot(reflectDir, viewDir);
if (reflectDotView > 0.9) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// Hi-Z Ray Tracing으로 반사 계산
let reflection = performRayMarching(viewPos, reflectDir);

// 반사가 발견되지 않았으면 원본 색상 사용
if (reflection.a <= 0.001) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 재질별 반사율 추정
let materialReflectance = max(0.04, estimateMaterialReflectance(originalColor.rgb));

// 프레넬과 재질 반사율 결합
let F0 = materialReflectance;
let fresnelReflectance = F0 + (1.0 - F0) * fresnel;

// 반사 강도 계산
let baseReflectionStrength = reflection.a * uniforms.reflectionIntensity;
let reflectionStrength = baseReflectionStrength * fresnelReflectance;
let reflectionColor = reflection.rgb * reflectionStrength;

// 물리적으로 정확한 색상 혼합
let kS = min(1.0, fresnelReflectance);
let kD = 1.0 - kS;

let diffuseColor = originalColor.rgb * kD;
var finalColor = diffuseColor + reflectionColor;

// 밝기 정규화
let maxComponent = max(max(finalColor.r, finalColor.g), finalColor.b);
if (maxComponent > 1.0) {
    finalColor = finalColor / maxComponent;
}

// 최종 결과 저장
textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
