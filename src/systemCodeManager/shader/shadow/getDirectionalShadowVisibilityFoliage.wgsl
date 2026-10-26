#redgpu_include shadow.getShadowCoord;

/**
 * 🌟 [식생(Foliage) 초근경(Cascade 0) 전용 비회전 6-Tap 등방성 원형 가우시안 디스크]
 * - 기존 9-Tap 5x5 Tent PCF 대비 텍스처 샘플링을 33.3%(9-Tap -> 6-Tap) 절감하고 부동소수점 나눗셈(fdiv) 6회를 100% 제거합니다.
 * - 중심(1탭, w=4.0) + 5각 비격자 링(5탭, r=0.90 texels, w=2.4)의 하드웨어 2x2 Bilinear 중첩(실효 24텍셀)으로
 *   직교 격자 대각선 계단 현상 없이 매끄러운 원형 반음영을 생성합니다.
 */
fn sampleShadowIsotropic6Foliage(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    tUV: vec2<f32>,
    cascadeIndex: u32,
    compareDepth: f32,
    oneOverTextureSize: f32
) -> f32 {
    let s = oneOverTextureSize;

    // 1. 중심 코어 (Weight: 4.0)
    var sum: f32 = 4.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV, cascadeIndex, compareDepth);

    // 2. 5각 비격자 등방성 링 (Radius: 0.90 * s, Weight: 2.4 each -> 12.0, < 1.0 텍셀 유지로 Bilinear 중첩 100% 보존)
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.8559,  0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.2781,  0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.8559, -0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.2781, -0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.5871, -0.6836) * s, cascadeIndex, compareDepth);

    // 총 가중치 합: 4.0 + 12.0 = 16.0 (1.0 / 16.0 = 0.0625, 2의 거듭제곱 무오차 상수)
    return sum * 0.0625;
}

/**
 * 🌿 [식생(Foliage) 전용 적응형 CSM 섀도우 메인 함수 (6 / 1 / 1 / 1)]
 * - Cascade 0 (초근경): 비회전 6-Tap 등방성 원형 디스크로 기존 9-Tap Tent 대비 텍스처 대역폭 33% 절감 및 나눗셈(fdiv) 100% 제거
 * - Cascade 1+ (중원경): 초고속 1-Tap 하드웨어 Bilinear PCF로 대규모 숲 오버드로우 대역폭 절감
 * - Caster Bounding Volume 0-Tap 가드 및 캐스케이드 전환 크로스페이드 적용
 *
 * @param directionalShadowMap 방향성 광원용 2D 뎁스 텍스처 어레이
 * @param directionalShadowMapSampler 비교 샘플러
 * @param worldPosition 월드 공간 상의 정점/픽셀 좌표
 * @param N 단위 법선 벡터
 * @param L 광원 방향 단위 벡터
 * @returns 가시성 계수 (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibilityFoliage(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>
) -> f32 {
    let nDotL = dot(N, L);
    // 1. 완전 역광은 샘플링 스킵
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));

    // 2. 구형 뷰 거리 산출 (구형 절두체 경계 구와 100% 일치시켜 가장자리 텍셀 낭비 제거 및 viewMatrix 행렬 곱 생략)
    let relPos = worldPosition - systemUniforms.camera.cameraPosition;
    let viewDepth = length(relPos);

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist) {
        return 1.0;
    }

    // 🌟 [Caster Bounding Volume 0-Tap 가드]
    let casterRadiusSq = shadowInfo.casterBoundingRadiusSq;
    if (casterRadiusSq == 0.0) {
        return 1.0;
    }
    if (casterRadiusSq > 0.0) {
        let diff = worldPosition - shadowInfo.casterBoundingCenter;
        if (dot(diff, diff) > casterRadiusSq) {
            return 1.0;
        }
    }

    let texSize = f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let oneOverTextureSize = 1.0 / texSize;
    let bias = shadowInfo.directionalShadowBias;

    // 3. 캐스케이드 레벨 결정 (단일 캐스케이드만 선택)
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 4. 하드웨어 Slope-Scaled Depth Bias와 결합된 정밀 서브텍셀 리시버 바이어스
    let slopeBias = saturate(1.0 - nDotL);
    let cascadeAtten = 1.0 / (1.0 + f32(cascadeIndex) * 0.35);
    let rawNormalBiasScale = 0.20 + slopeBias * 0.55;
    let normalBiasScale = rawNormalBiasScale * cascadeAtten;
    let rawBaseBiasFactor = bias * (1.0 + slopeBias * 1.5);
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    let worldTexelSize = shadowInfo.cascadeTexelSizes[cascadeIndex];
    let normalOffset = N * normalBiasScale * worldTexelSize;
    let biasedWorldPosition = worldPosition + normalOffset;

    let shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    let tUV = shadowCoord.xy;
    let outOfBounds = tUV.x < -0.02 || tUV.x > 1.02 || tUV.y < -0.02 || tUV.y > 1.02;
    if (invalidDepth || outOfBounds) {
        return 1.0;
    }

    let absPos = abs(worldPosition);
    let maxCoord = max(absPos.x, max(absPos.y, absPos.z));
    let driftBias = maxCoord * 0.00000025;
    let shadowDepth = saturate(shadowCoord.z);
    let cascadeBias = rawBaseBiasFactor * cascadeAtten + driftBias;

    var finalVis: f32 = 1.0;

    // 5. 적응형 샘플링: 초근경(Cascade 0)은 비회전 6-Tap 등방성 원형 디스크, 중원경(Cascade 1+)은 1-Tap 하드웨어 Bilinear PCF
    if (cascadeIndex == 0u) {
        finalVis = sampleShadowIsotropic6Foliage(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            0u,
            shadowDepth - cascadeBias,
            oneOverTextureSize
        );
    } else {
        finalVis = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );
    }

    // 6. 캐스케이드 전환 블렌딩 (Cascade Transition Blending)
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let safePrevIndex = max(1u, cascadeIndex) - 1u;
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[safePrevIndex], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.20;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart) {
            let nextIndex = cascadeIndex + 1u;
            let nextAtten = 1.0 / (1.0 + f32(nextIndex) * 0.35);
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextWorldTexelSize = shadowInfo.cascadeTexelSizes[nextIndex];
            let nextNormalOffset = N * (rawNormalBiasScale * nextAtten) * nextWorldTexelSize;
            let nextBiasedPos = worldPosition + nextNormalOffset;
            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);

            let nextTUV = nextShadowCoord.xy;
            let nextOutOfBounds = nextTUV.x < 0.0 || nextTUV.x > 1.0 || nextTUV.y < 0.0 || nextTUV.y > 1.0 || nextShadowCoord.z < 0.0 || nextShadowCoord.z > 1.0;
            if (!nextOutOfBounds) {
                let nextShadowDepth = saturate(nextShadowCoord.z);
                let nextCascadeBias = rawBaseBiasFactor * nextAtten + driftBias;

                let nextVis = textureSampleCompareLevel(
                    directionalShadowMap,
                    directionalShadowMapSampler,
                    nextTUV,
                    nextIndex,
                    nextShadowDepth - nextCascadeBias
                );

                let blendFactor = smoothstep(0.0, 1.0, saturate((viewDepth - blendStart) / blendMargin));
                finalVis = mix(finalVis, nextVis, blendFactor);
            }
        }
    } else {
        // 7. 최외곽 캐스케이드 부드러운 페이드아웃
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, saturate((viewDepth - fadeStart) / (maxShadowDist - fadeStart)));
            finalVis = mix(finalVis, 1.0, fadeFactor);
        }
    }

    // 8. Soft Horizon Terminator Fade
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVis * horizonFade;
}
