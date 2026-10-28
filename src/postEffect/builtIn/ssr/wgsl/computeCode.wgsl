// [KO] 1. 기초 데이터 로드 및 조기 종료 조건 확인
// [EN] 1. Load basic data and check early exit conditions
let screenCoord = vec2<i32>(global_id.xy);
let texDims = textureDimensions(sourceTexture);
let texSize = vec2<i32>(texDims);

if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

let originalColor = textureLoad(sourceTexture, screenCoord, 0);
let depth = textureLoad(depthTexture, screenCoord, 0);

// 배경(Skybox) 영역은 반사 계산 제외
if (depth >= 0.999) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// [KO] G-Buffer 데이터 추출 및 유효성 검사
// [EN] Extract G-Buffer data and validate
let gBufferNormalData = textureLoad(gBufferNormalTexture, screenCoord, 0);
let precomputedReflectionStrength = gBufferNormalData.a; // 머티리얼의 반사도(Metallic/Roughness 영향)

if (precomputedReflectionStrength < 0.05) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// [KO] 2. 월드 공간 정보 복원
// [EN] 2. Restore world space information
let uv = (vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texDims);
let worldPos = reconstructWorldPosition(uv, depth);
let worldNormal = getWorldNormalFromGNormalBuffer(gBufferNormalData.rgb);

if (length(worldNormal) < 0.01) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let normal = normalize(worldNormal);
let cameraWorldPos = systemUniforms.camera.inverseViewMatrix[3].xyz;

// [KO] 3. 반사 광선(Reflection Ray) 산출 및 레이 마칭 수행
// [EN] 3. Calculate Reflection Ray and perform Ray Marching
let reflectionDir = calculateWorldReflectionRay(worldPos, normal, cameraWorldPos);
let reflection = performWorldRayMarching(worldPos, reflectionDir, screenCoord);

// [KO] 4. 반사 결과 합성
// [EN] 4. Reflection result composition
if (reflection.a > 0.001) {
    // 최종 반사 강도 = 레이 충돌 강도 * 유니폼 강도 * 머티리얼 반사도
    let finalReflectionStrength = reflection.a *
                                 uniforms.reflectionIntensity *
                                 precomputedReflectionStrength;

    let reflectionColor = reflection.rgb * finalReflectionStrength;
    let diffuseColor = originalColor.rgb * (1.0 - finalReflectionStrength);
    let finalColor = diffuseColor + reflectionColor;

    textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
} else {
    textureStore(outputTexture, screenCoord, originalColor);
}
