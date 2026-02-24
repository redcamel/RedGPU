/**
 * [KO] SSAO(Screen Space Ambient Occlusion) 계산을 위한 컴퓨팅 셰이더입니다.
 * [EN] Compute shader for SSAO (Screen Space Ambient Occlusion) calculation.
 */
{
    // [KO] 1. 초기화 및 입력 데이터 추출 [EN] 1. Initialization and input data extraction
    let screenCoord = vec2<i32>(global_id.xy);
    let texSize     = vec2<i32>(textureDimensions(sourceTexture));

    // [KO] 화면 경계 검사 및 배경(깊이 없음) 처리 [EN] Screen boundary check and background (no depth) handling
    if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

    let originalColor = textureLoad(sourceTexture, screenCoord);
    let depth         = textureLoad(depthTexture, screenCoord, 0);

    // [KO] 블러 사용 여부에 따른 실패 시 기본 색상 설정 [EN] Set default fail color based on blur usage
    var failColor = vec4<f32>(select(originalColor.rgb, vec3<f32>(1.0), uniforms.useBlur > 0.0), originalColor.a);
    if (depth < 0.001) {
        textureStore(outputTexture, screenCoord, failColor);
        return;
    }

    let normalData = textureLoad(gBufferNormalTexture, screenCoord, 0);

    // [KO] 유효하지 않은 노말 데이터 처리 [EN] Handle invalid normal data
    if (length(normalData.rgb) < 0.001) {
        textureStore(outputTexture, screenCoord, failColor);
        return;
    }

    // [KO] 2. 뷰 공간(View Space) 데이터 복원 [EN] 2. Restore View Space data
    let viewPos      = getViewPositionFromDepth((vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texSize), depth, systemUniforms.projection.inverseProjectionMatrix);
    let viewNormal   = getViewNormalFromGNormalBuffer(normalData.rgb, systemUniforms.camera.viewMatrix);
    let distToCamera = -viewPos.z;

    // [KO] 3. 거리 기반 적응형 반경(Adaptive Radius) 계산 [EN] 3. Calculate distance-based Adaptive Radius
    // [KO] 카메라와의 거리에 비례하여 샘플링 반경을 키워 원근감을 보정합니다.
    // [EN] Scale the sampling radius proportional to the distance from the camera to correct perspective.
    let depthScale = distToCamera * 0.1;
    let adaptiveRadius = uniforms.radius * (1.0 + depthScale);

    // [KO] 4. TBN 매트릭스 생성 (노이즈 기반의 로컬 좌표계 구성) [EN] 4. Generate TBN matrix (noise-based local coordinate system)
    let noiseVec  = getNoiseVec(vec2<f32>(screenCoord));
    let tbn       = getTBN(viewNormal, noiseVec);

    // [KO] 5. 샘플 커널 정의 (8개 샘플 포인트) [EN] 5. Define sample kernel (8 sample points)
    let samples = array<vec3<f32>, 8>(
        vec3<f32>(0.04, 0.03, 0.08),    vec3<f32>(-0.04, 0.04, 0.08),
        vec3<f32>(0.10, -0.08, 0.18),   vec3<f32>(-0.09, -0.10, 0.18),
        vec3<f32>(0.18, 0.15, 0.30),    vec3<f32>(-0.17, 0.18, 0.30),
        vec3<f32>(0.28, -0.25, 0.45),   vec3<f32>(-0.27, -0.28, 0.45)
    );

    // [KO] 6. 차폐도(Occlusion) 계산 루프 [EN] 6. Occlusion calculation loop
    var totalOcclusion = 0.0;

    for (var i = 0u; i < 8u; i++) {
        // [KO] 샘플 포인트의 뷰 공간 위치 계산 [EN] Calculate view space position of sample point
        let sampleOffset  = tbn * samples[i];
        let sampleDir     = normalize(sampleOffset);
        let sampleViewPos = viewPos + sampleOffset * adaptiveRadius;

        // [KO] 투영 행렬을 통해 샘플 좌표를 UV 평면으로 변환 [EN] Transform sample coordinates to UV plane via projection matrix
        let clipPos  = systemUniforms.projection.projectionMatrix * vec4<f32>(sampleViewPos, 1.0);
        let sampleUV = (clipPos.xy / clipPos.w) * vec2<f32>(0.5, -0.5) + 0.5;

        // [KO] UV 경계 검사 [EN] UV boundary check
        if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) {
            continue;
        }

        // [KO] 해당 샘플 위치의 실제 깊이 값 복원 [EN] Restore actual depth value at the sample position
        let sampleCoord = vec2<i32>(sampleUV * vec2<f32>(texSize));
        let realDepth   = textureLoad(depthTexture, sampleCoord, 0);

        if (realDepth < 0.001) { continue; }

        let realViewPos = getViewPositionFromDepth(sampleUV, realDepth, systemUniforms.projection.inverseProjectionMatrix);

        // [KO] 자기 차폐 방지를 위한 적응형 바이어스 계산 [EN] Calculate adaptive bias to prevent self-occlusion
        let adaptiveBias = uniforms.bias * (1.0 + distToCamera * uniforms.biasDistanceScale);
        let deltaZ = realViewPos.z - sampleViewPos.z;

        // [KO] 차폐 판정 (범위 내에 실제 지형이 있을 경우) [EN] Occlusion test (if real terrain is within range)
        if (deltaZ > adaptiveBias && deltaZ < adaptiveRadius * 1.5) {
            let sampleDist = length(viewPos - realViewPos);

            // [KO] 거리에 따른 감쇠 및 노말 각도 가중치 적용 [EN] Apply distance falloff and normal angle weighting
            if (sampleDist < adaptiveRadius * 1.5) {
                let angleWeight = pow(max(0.0, dot(viewNormal, sampleDir)), 2.0);
                let distFalloff = 1.0 - smoothstep(0.0, adaptiveRadius * 1.5, sampleDist);

                totalOcclusion += angleWeight * distFalloff;
            }
        }
    }

    // [KO] 7. AO 강도 및 거리 기반 페이드 적용 [EN] 7. Apply AO intensity and distance-based fade
    let ao = (totalOcclusion / 8.0) * uniforms.intensity;

    // [KO] 먼 거리에서 AO가 급격히 끊기지 않도록 강도를 부드럽게 제거 [EN] Smoothly fade out AO at far distances
    let distanceFade = smoothstep(
        uniforms.fadeDistanceStart + uniforms.fadeDistanceRange,
        uniforms.fadeDistanceStart,
        distToCamera
    );

    // [KO] 최종 AO 계산 및 대비(Contrast) 조절 [EN] Final AO calculation and contrast adjustment
    var finalAO = saturate(1.0 - (ao * distanceFade));
    finalAO = pow(finalAO, uniforms.contrast);

    // [KO] 8. 최종 색상 합성 및 결과 출력 [EN] 8. Final color synthesis and result output
    let finalColor = vec4<f32>(
        select(originalColor.rgb * vec3<f32>(finalAO), vec3<f32>(finalAO), uniforms.useBlur > 0.0),
        originalColor.a
    );

    textureStore(outputTexture, screenCoord, finalColor);
}
