/**
 * [KO] 1차 테일러 탄젠트 평면 외삽(Tangent-Plane Extrapolation) 및 4x4 주기 정합 대칭 사다리꼴 적분 디노이저 (Full-Res)
 * [EN] 1st-order Taylor Tangent-Plane Extrapolation and 4x4 period-matched symmetric trapezoidal integration denoiser (Full-Res)
 */
{
    let screenCoord = vec2<i32>(global_id.xy);
    let texSize     = vec2<i32>(postEffectOutputDimensions);

    if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

    let maxCoord   = texSize - vec2<i32>(1);
    let centerData = textureLoad(sourceTexture, screenCoord, 0);
    let centerAO   = centerData.r;
    let centerLinZ = centerData.g;

    // [KO] 배경 하늘 또는 무효 깊이 픽셀(centerLinZ <= 0.0)은 필터링 없이 즉시 반환
    // [EN] Immediately return for background sky or invalid depth pixels (centerLinZ <= 0.0) without filtering
    if (centerLinZ <= 0.0) {
        textureStore(outputTexture, screenCoord, centerData);
        return;
    }

    // [KO] 중심 픽셀 옥타헤드럴 뷰 법선 복원
    // [EN] Decode octahedral view normal of the center pixel
    let cOct = centerData.ba;
    var cN   = vec3<f32>(cOct.x, cOct.y, 1.0 - abs(cOct.x) - abs(cOct.y));
    if (cN.z < 0.0) {
        cN = vec3<f32>((1.0 - abs(cN.yx)) * select(vec2<f32>(-1.0), vec2<f32>(1.0), cN.xy >= vec2<f32>(0.0)), cN.z);
    }
    let centerNormal = normalize(cN);

    // [KO] 1. 단측 최소 차분(Min-Abs One-Sided Difference)을 통한 실제 기하 탄젠트 평면의 정확한 깊이 편미분(dZx, dZy) 산출
    // [EN] 1. Exact depth partial derivatives (dZx, dZy) of the geometric tangent plane via min-abs one-sided differences
    let zLeft  = textureLoad(sourceTexture, max(screenCoord - vec2<i32>(1, 0), vec2<i32>(0)), 0).g;
    let zRight = textureLoad(sourceTexture, min(screenCoord + vec2<i32>(1, 0), maxCoord), 0).g;
    let zUp    = textureLoad(sourceTexture, max(screenCoord - vec2<i32>(0, 1), vec2<i32>(0)), 0).g;
    let zDown  = textureLoad(sourceTexture, min(screenCoord + vec2<i32>(0, 1), maxCoord), 0).g;

    let diffXNeg = centerLinZ - zLeft;
    let diffXPos = zRight - centerLinZ;
    let validXNeg = zLeft > 0.0;
    let validXPos = zRight > 0.0;
    let dZx = select(
        select(0.0, diffXPos, validXPos),
        select(diffXNeg, select(diffXPos, diffXNeg, abs(diffXNeg) < abs(diffXPos)), validXPos),
        validXNeg
    );

    let diffYNeg = centerLinZ - zUp;
    let diffYPos = zDown - centerLinZ;
    let validYNeg = zUp > 0.0;
    let validYPos = zDown > 0.0;
    let dZy = select(
        select(0.0, diffYPos, validYPos),
        select(diffYNeg, select(diffYPos, diffYNeg, abs(diffYNeg) < abs(diffYPos)), validYPos),
        validYNeg
    );

    // [KO] 2. 투영 행렬(invP[1][1] = tan(fovY/2))로부터 현재 깊이(centerLinZ)에서의 물리적 1픽셀 월드 크기 및 1차 테일러 오차 한계 산출
    // [EN] 2. Compute physical 1-pixel world size and 1st-order Taylor error bound at current depth (centerLinZ) from projection matrix
    let invP            = systemUniforms.projection.inverseProjectionMatrix;
    let pixelWorldSize  = centerLinZ * abs(invP[1][1]) * (2.0 / f32(texSize.y));
    let planeToleranceZ = pixelWorldSize + abs(dZx) + abs(dZy);

    var aoSum     = 0.0;
    var weightSum = 0.0;

    // [KO] 3. 4x4 층화 노이즈의 16개 위상을 정확히 1/16씩 등가중 적분하는 대칭 사다리꼴(Trapezoidal) 5x5 필터
    //         w1D(-2)=0.5, w1D(-1)=1.0, w1D(0)=1.0, w1D(+1)=1.0, w1D(+2)=0.5  (-2 ≡ +2 mod 4 => 0.5 + 0.5 = 1.0)
    // [EN] 3. Symmetric trapezoidal 5x5 filter that integrates all 16 phases of the 4x4 stratified noise with equal 1/16 weight
    for (var dy = -2; dy <= 2; dy++) {
        let wy = select(1.0, 0.5, abs(dy) == 2);
        for (var dx = -2; dx <= 2; dx++) {
            let wx            = select(1.0, 0.5, abs(dx) == 2);
            let spatialWeight = wx * wy;

            let sampleCoord = clamp(screenCoord + vec2<i32>(dx, dy), vec2<i32>(0), maxCoord);
            let sampleData  = textureLoad(sourceTexture, sampleCoord, 0);
            let sampleLinZ  = sampleData.g;

            if (sampleLinZ <= 0.0) { continue; }

            // 1차 테일러 탄젠트 평면 예측 깊이: Z_plane(dx, dy) = Z_c + dZx * dx + dZy * dy
            let expectedLinZ = centerLinZ + dZx * f32(dx) + dZy * f32(dy);
            let planeError   = abs(sampleLinZ - expectedLinZ);
            let depthWeight  = saturate(1.0 - planeError / planeToleranceZ);

            let sOct = sampleData.ba;
            var sN   = vec3<f32>(sOct.x, sOct.y, 1.0 - abs(sOct.x) - abs(sOct.y));
            if (sN.z < 0.0) {
                sN = vec3<f32>((1.0 - abs(sN.yx)) * select(vec2<f32>(-1.0), vec2<f32>(1.0), sN.xy >= vec2<f32>(0.0)), sN.z);
            }
            let sampleNormal = normalize(sN);

            // 람베르트 코사인 법선 가중치: max(0, dot(N_s, N_c))
            let normalWeight = saturate(dot(sampleNormal, centerNormal));

            let w = spatialWeight * depthWeight * normalWeight;
            aoSum     += sampleData.r * w;
            weightSum += w;
        }
    }

    let denoisedAO = select(centerAO, aoSum / weightSum, weightSum > 0.0);
    textureStore(outputTexture, screenCoord, vec4<f32>(denoisedAO, centerLinZ, centerData.b, centerData.a));
}
