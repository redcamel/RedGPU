{
    // 1. 초기화 및 입력 데이터 추출
    let screenCoord = vec2<i32>(global_id.xy);
    let texSize     = vec2<i32>(textureDimensions(sourceTexture));

    // 화면 경계 검사 및 배경(깊이 없음) 처리
    if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

    let originalColor = textureLoad(sourceTexture, screenCoord);
    let depth         = textureLoad(depthTexture, screenCoord, 0);

    var failColor = vec4<f32>(select(originalColor.rgb, vec3<f32>(1.0), uniforms.useBlur > 0.0), originalColor.a);
    if (depth < 0.001) {
        textureStore(outputTexture, screenCoord, failColor);
        return;
    }

    let normalData = textureLoad(gBufferNormalTexture, screenCoord, 0);

    //  노멀 데이터가 유효하지 않다면 날리기
    if (length(normalData.rgb)<0.001) {
        textureStore(outputTexture, screenCoord, failColor);
        return;
    }
    // 2. 뷰 공간(View Space) 데이터 복원
    let viewPos      = reconstructViewPositionFromDepth((vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texSize), depth, systemUniforms.inverseProjectionMatrix);
    let viewNormal   = reconstructViewNormal(textureLoad(gBufferNormalTexture, screenCoord, 0));
    let distToCamera = -viewPos.z;


    // 3. 거리 기반 적응형 반경(Adaptive Radius) 계산
    // 카메라와의 거리에 비례하여 샘플링 반경을 키워 원근감을 보정합니다.
    let depthScale = distToCamera * 0.1;
    let adaptiveRadius = uniforms.radius * (1.0 + depthScale);

    // 4. TBN 매트릭스 생성 (노멀 기반의 로컬 좌표계 구성)
    let noiseVec  = getNoiseVec(vec2<f32>(screenCoord));
    let tangent   = normalize(noiseVec - viewNormal * dot(noiseVec, viewNormal));
    let bitangent = cross(viewNormal, tangent);
    let tbn       = mat3x3<f32>(tangent, bitangent, viewNormal);

    // 5. 샘플 커널 정의 (8개 샘플 포인트)
    let samples = array<vec3<f32>, 8>(
        vec3<f32>(0.04, 0.03, 0.08),    vec3<f32>(-0.04, 0.04, 0.08),
        vec3<f32>(0.10, -0.08, 0.18),   vec3<f32>(-0.09, -0.10, 0.18),
        vec3<f32>(0.18, 0.15, 0.30),    vec3<f32>(-0.17, 0.18, 0.30),
        vec3<f32>(0.28, -0.25, 0.45),   vec3<f32>(-0.27, -0.28, 0.45)
    );

    // 6. 차폐도(Occlusion) 계산 루프
    var totalOcclusion = 0.0;

    for (var i = 0u; i < 8u; i++) {
        // 샘플 포인트의 뷰 공간 위치 계산
        let sampleOffset  = tbn * samples[i];
        let sampleDir     = normalize(sampleOffset);
        let sampleViewPos = viewPos + sampleOffset * adaptiveRadius;

        // 투영 행렬을 통해 샘플 좌표를 UV 평면으로 변환
        let clipPos  = systemUniforms.projectionMatrix * vec4<f32>(sampleViewPos, 1.0);
        let sampleUV = (clipPos.xy / clipPos.w) * vec2<f32>(0.5, -0.5) + 0.5;

        // UV 경계 검사
        if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) {
            continue;
        }

        // 해당 샘플 위치의 실제 깊이 값 복원
        let sampleCoord = vec2<i32>(sampleUV * vec2<f32>(texSize));
        let realDepth   = textureLoad(depthTexture, sampleCoord, 0);

        if (realDepth < 0.001) { continue; }

        let realViewPos = reconstructViewPositionFromDepth(sampleUV, realDepth, systemUniforms.inverseProjectionMatrix);

        // 자가 차폐 방지를 위한 적응형 바이어스 계산
        let adaptiveBias = uniforms.bias * (1.0 + distToCamera * uniforms.biasDistanceScale);
        let deltaZ = realViewPos.z - sampleViewPos.z;

        // 차폐 판정 (범위 내에 실제 지형이 있을 경우)
        if (deltaZ > adaptiveBias && deltaZ < adaptiveRadius * 1.5) {
            let sampleDist = length(viewPos - realViewPos);

            // 거리에 따른 감쇠 및 노멀 각도 가중치 적용
            if (sampleDist < adaptiveRadius * 1.5) {
                let angleWeight = pow(max(0.0, dot(viewNormal, sampleDir)), 2.0);
                let distFalloff = 1.0 - smoothstep(0.0, adaptiveRadius * 1.5, sampleDist);

                totalOcclusion += angleWeight * distFalloff;
            }
        }
    }

    // 7. AO 강도 및 거리 기반 페이드 적용
    let ao = (totalOcclusion / 8.0) * uniforms.intensity;

    // 원거리에서 AO가 급격히 나타나지 않도록 부드럽게 제거
    let distanceFade = smoothstep(
        uniforms.fadeDistanceStart + uniforms.fadeDistanceRange,
        uniforms.fadeDistanceStart,
        distToCamera
    );

    // 최종 AO 계산 및 대비(Contrast) 조절
    var finalAO = saturate(1.0 - (ao * distanceFade));
    finalAO = pow(finalAO, uniforms.contrast);

    // 8. 최종 색상 합성 및 결과 출력
    // 디버깅/블러 모드에 따라 원본 합성 여부 결정
    let finalColor = vec4<f32>(
        select(originalColor.rgb * vec3<f32>(finalAO), vec3<f32>(finalAO), uniforms.useBlur > 0.0),
        originalColor.a
    );

    textureStore(outputTexture, screenCoord, finalColor);
}
