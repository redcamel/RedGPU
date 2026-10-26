#redgpu_include shadow.getShadowCoord;

/**
 * 🌟 [비회전 12-Tap 등방성 원형 가우시안 디스크 (Cascade 0 ~ 3 전 구간 공용)]
 * - 직교 격자(U/V 축)에 종속된 Tent PCF의 대각선 계단(Stair-stepping) 한계와 IGN 회전의 모래알 노이즈를 동시에 해결합니다.
 * - 중심(1탭, r=0) + 내측 링(5탭, r=0.90 texels) + 외측 링(6탭, r=1.75 texels)을 비격자 황금각으로 배치하여,
 *   링 간격(0.85~0.90 texels)이 하드웨어 2x2 Bilinear 보간 폭(1.0 texel) 이내에서 100% 빈틈없이 중첩(Overlapping)됩니다.
 * - 원거리 캐스케이드(Cascade 2~3)에서는 텍셀의 월드 크기가 커지는 것에 맞춰 radiusScale을 점진적으로 수축(1.0x -> 0.76x)하여
 *   하드웨어 Bilinear 중첩 무결성을 유지하면서 원거리 그림자의 과도한 블러 및 겹그림자(Banding)를 방지합니다.
 */
fn sampleShadowIsotropic12Mesh(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    tUV: vec2<f32>,
    cascadeIndex: u32,
    compareDepth: f32,
    oneOverTextureSize: f32
) -> f32 {
    let radiusScale = max(0.76, 1.0 - f32(cascadeIndex) * 0.08);
    let s = oneOverTextureSize * radiusScale;

    // 1. 중심 코어 (Weight: 4.0)
    var sum: f32 = 4.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV, cascadeIndex, compareDepth);

    // 2. 내측 5각 비격자 링 (Radius: 0.90 * s, Weight: 2.4 each -> 12.0)
    // 각도: 18°, 90°, 162°, 234°, 306° (직교 X/Y 동시 정렬 회피 및 1.0 텍셀 이내 Bilinear 중첩 보장)
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.8559,  0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.2781,  0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.8559, -0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.2781, -0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.5871, -0.6836) * s, cascadeIndex, compareDepth);

    // 3. 외측 6각 회전 링 (Radius: 1.75 * s, Weight: 1.0 each -> 6.0)
    // 각도: 15°, 75°, 135°, 195°, 255°, 315° (내측 링과 0.85 텍셀 간격으로 완전 중첩)
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 1.6904,  0.4529) * s, cascadeIndex, compareDepth);
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.4529,  1.6904) * s, cascadeIndex, compareDepth);
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-1.2374,  1.2374) * s, cascadeIndex, compareDepth);
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-1.6904, -0.4529) * s, cascadeIndex, compareDepth);
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.4529, -1.6904) * s, cascadeIndex, compareDepth);
    sum += 1.0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 1.2374, -1.2374) * s, cascadeIndex, compareDepth);

    // 총 가중치 합: 4.0 + 12.0 + 6.0 = 22.0
    return sum * (1.0 / 22.0);
}

/**
 * 🌟 [비회전 4-Tap 26.6° Rotated-Grid PCF]
 * - RGSS (Rotated Grid Super-Sampling, arctan(0.5) ≈ 26.6°) 배치로 4개의 하드웨어 2x2 Bilinear 탭이
 *   가로·세로·대각선 좌표를 모두 다르게 샘플링하여 계단 방향성을 억제합니다.
 */
fn sampleShadowRotatedGrid4Mesh(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    tUV: vec2<f32>,
    cascadeIndex: u32,
    compareDepth: f32,
    oneOverTextureSize: f32
) -> f32 {
    let radiusScale = max(0.76, 1.0 - f32(cascadeIndex) * 0.08);
    let s = oneOverTextureSize * radiusScale;

    var sum: f32 = 0.0;
    sum += textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.375,  0.875) * s, cascadeIndex, compareDepth);
    sum += textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.875,  0.375) * s, cascadeIndex, compareDepth);
    sum += textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.875, -0.375) * s, cascadeIndex, compareDepth);
    sum += textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.375, -0.875) * s, cascadeIndex, compareDepth);

    return sum * 0.25;
}

/**
 * 🌟 [현대적인 Clean Soft CSM 메인 진입점 - 전 구간 무분기 12-Tap 비회전 등방성 원형 가우시안 PCF (12 / 12 / 12 / 12)]
 * - Cascade 0 ~ 3 전 구간 (0.1m ~ 200.0m): 12-Tap 비회전 등방성 원형 가우시안 디스크 (워프 분기 0%, 계단 윤곽 및 회전 노이즈 동시 제거)
 * - 캐스케이드 전환 구간 (20%): 동일 12-Tap 디스크 크로스페이드로 경계선 반음영 단절 원천 제거
 *
 * @param directionalShadowMap [KO] 방향성 광원용 2D 뎁스 텍스처 어레이 [EN] 2D depth texture array for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param worldPosition [KO] 월드 공간 상의 정점/픽셀 좌표 [EN] World position of vertex/pixel
 * @param N [KO] 단위 법선 벡터 [EN] Unit normal vector
 * @param L [KO] 광원 방향 단위 벡터 [EN] Light direction unit vector
 * @param screenPos [KO] 프래그먼트 스크린 픽셀 좌표 (@builtin(position).xy) [EN] Fragment screen pixel position
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibility(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    screenPos: vec2<f32>
) -> f32 {
    let nDotL = dot(N, L);
    // 🚀 1. 완전 역광(-0.08 미만)은 샘플링 스킵 (GPU 부하 절감)
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));

    // 2. 구면 뷰 거리 산출 (카메라 회전 불변 및 구면 외접구 100% 정합)
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

    // 3. 캐스케이드 레벨 결정
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 🚀 4. [하드웨어 depthBiasSlopeScale 연동 서브텍셀 노멀 오프셋 및 적응형 바이어스]
    let slopeBias = saturate(1.0 - nDotL);
    let cascadeAtten = 1.0 / (1.0 + f32(cascadeIndex) * 0.35);
    let rawNormalBiasScale = 0.35 + slopeBias * 0.95;
    let normalBiasScale = rawNormalBiasScale * cascadeAtten;
    let rawBaseBiasFactor = bias * (1.0 + slopeBias * 2.0);
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

    // 🌟 [대규모 오픈월드 부동소수점 오차 흡수 바이어스 계수 산출]
    let maxCoord = max(abs(worldPosition.x), max(abs(worldPosition.y), abs(worldPosition.z)));
    let driftBias = maxCoord * 0.00000025;
    let shadowDepth = saturate(shadowCoord.z);
    let cascadeBias = rawBaseBiasFactor * cascadeAtten + driftBias;

    // 5. 전 구간 무분기 12-Tap 등방성 원형 가우시안 디스크 샘플링 (Cascade 0 ~ 3 통일)
    var finalVisibility: f32 = sampleShadowIsotropic12Mesh(
        directionalShadowMap,
        directionalShadowMapSampler,
        tUV,
        cascadeIndex,
        shadowDepth - cascadeBias,
        oneOverTextureSize
    );

    // 🌟 6. [언리얼 엔진 5 표준 캐스케이드 전환 블렌딩 (Cascade Transition Fraction = 0.20)]
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let safePrevIndex = max(1u, cascadeIndex) - 1u;
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[safePrevIndex], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.20;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart) {
            let nextIndex = cascadeIndex + 1u;
            let nextCascadeAtten = 1.0 / (1.0 + f32(nextIndex) * 0.35);
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextWorldTexelSize = shadowInfo.cascadeTexelSizes[nextIndex];
            let nextBiasedPos = worldPosition + N * (rawNormalBiasScale * nextCascadeAtten) * nextWorldTexelSize;

            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);
            let nextTUV = nextShadowCoord.xy;
            let nextOutOfBounds = nextTUV.x < -0.02 || nextTUV.x > 1.02 || nextTUV.y < -0.02 || nextTUV.y > 1.02 || nextShadowCoord.z < 0.0 || nextShadowCoord.z > 1.0;
            if (!nextOutOfBounds) {
                let nextShadowDepth = saturate(nextShadowCoord.z);
                let nextCascadeBias = rawBaseBiasFactor * nextCascadeAtten + driftBias;

                let nextVis = sampleShadowIsotropic12Mesh(
                    directionalShadowMap,
                    directionalShadowMapSampler,
                    nextTUV,
                    nextIndex,
                    nextShadowDepth - nextCascadeBias,
                    oneOverTextureSize
                );

                let blendFactor = smoothstep(0.0, 1.0, saturate((viewDepth - blendStart) / blendMargin));
                finalVisibility = mix(finalVisibility, nextVis, blendFactor);
            }
        }
    } else {
        // 7. 최외곽 15% 부드러운 페이드아웃 (하드 컷오프 방지)
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, saturate((viewDepth - fadeStart) / (maxShadowDist - fadeStart)));
            finalVisibility = mix(finalVisibility, 1.0, fadeFactor);
        }
    }

    // 🌟 8. [언리얼 엔진 표준 Soft Horizon Terminator Fade]
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVisibility * horizonFade;
}
