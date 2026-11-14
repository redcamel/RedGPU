// [KO] 1. 기초 데이터 로드 및 조기 종료 조건 확인
// [EN] 1. Load basic data and check early exit conditions
let screenCoord = vec2<i32>(global_id.xy);
let texSizeF = vec2<f32>(postEffectOutputDimensions);

let originalColor = textureLoad(sourceTexture, screenCoord, 0);
let depth = textureLoad(depthTexture, screenCoord, 0);

// 배경(Skybox, Standard-Z depth == 1.0) 영역은 반사 계산 제외
if (depth >= 1.0) {
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

// [KO] 2. 무행렬 뷰 공간(View-Space) 위치 및 법선 복원
// [EN] 2. Matrix-free View-Space position and normal reconstruction
let P = systemUniforms.projection.projectionMatrix;
let invP = systemUniforms.projection.inverseProjectionMatrix;
let projScale = vec2<f32>(P[0][0], P[1][1]);
let projJitter = vec2<f32>(P[2][0], P[2][1]);
let invFocalLen = vec2<f32>(invP[0][0], invP[1][1]);
let invJitter = vec2<f32>(invP[3][0], invP[3][1]);
let zParams = vec4<f32>(invP[2][2], invP[3][2], invP[2][3], invP[3][3]);

let uv = (vec2<f32>(screenCoord) + 0.5) / texSizeF;
let linearZ = depthToLinearZ(depth, zParams);
let viewPos = reconstructViewPosition(uv, linearZ, invFocalLen, invJitter);
let viewNormal = getViewNormalFromGNormalBuffer(gBufferNormalData.rgb, systemUniforms.camera.viewMatrix);

if (dot(viewNormal, viewNormal) < 0.0001) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let normal = normalize(viewNormal);
let incidentDir = normalize(viewPos);

// [KO] 3. 뷰 공간 반사 광선(Reflection Ray) 산출 및 무행렬 레이 마칭 수행
// [EN] 3. Calculate View-Space Reflection Ray and perform Matrix-Free Ray Marching
let reflectionDir = reflect(incidentDir, normal);
let reflection = performViewSpaceRayMarching(viewPos, reflectionDir, screenCoord, texSizeF, projScale, projJitter, zParams);

// [KO] 4. 반사 결과 합성
// [EN] 4. Reflection result composition
if (reflection.a > 0.001) {
    // 최종 반사 강도 = 레이 충돌 강도 * 유니폼 강도 * 머티리얼 반사도
    let finalReflectionStrength = reflection.a *
                                 uniforms.reflectionIntensity *
                                 precomputedReflectionStrength;

    let reflectionColor = reflection.rgb * finalReflectionStrength;
    let diffuseColor = originalColor.rgb * (1.0 - saturate(finalReflectionStrength));
    let finalColor = diffuseColor + reflectionColor;

    textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
} else {
    textureStore(outputTexture, screenCoord, originalColor);
}
