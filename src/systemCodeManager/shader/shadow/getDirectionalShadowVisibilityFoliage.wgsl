#redgpu_include shadow.getShadowCoord;

/**
 * 🌟 [언리얼 엔진 표준 9-Tap Optimized 5x5 Tent PCF (식생용)]
 * - 하드웨어 2x2 Bilinear 비교 샘플러를 활용하여 단 9-Tap으로 5x5 텐트 필터를 수학적으로 100% 재구성합니다.
 */
fn sampleShadowTent5x5Foliage(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    tUV: vec2<f32>,
    cascadeIndex: u32,
    compareDepth: f32,
    texSize: f32,
    oneOverTextureSize: f32
) -> f32 {
    let uv = tUV * texSize + vec2<f32>(0.5);
    let base = (floor(uv) - vec2<f32>(0.5)) * oneOverTextureSize;
    let st = fract(uv);

    let uw0 = 4.0 - 3.0 * st.x;
    let uw1 = 7.0;
    let uw2 = 1.0 + 3.0 * st.x;

    let vw0 = 4.0 - 3.0 * st.y;
    let vw1 = 7.0;
    let vw2 = 1.0 + 3.0 * st.y;

    let u0 = base.x + ((3.0 - 2.0 * st.x) / uw0 - 2.0) * oneOverTextureSize;
    let u1 = base.x + ((3.0 + st.x) / uw1) * oneOverTextureSize;
    let u2 = base.x + (st.x / uw2 + 2.0) * oneOverTextureSize;

    let v0 = base.y + ((3.0 - 2.0 * st.y) / vw0 - 2.0) * oneOverTextureSize;
    let v1 = base.y + ((3.0 + st.y) / vw1) * oneOverTextureSize;
    let v2 = base.y + (st.y / vw2 + 2.0) * oneOverTextureSize;

    var sum: f32 = 0.0;

    sum += uw0 * vw0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u0, v0), cascadeIndex, compareDepth);
    sum += uw1 * vw0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u1, v0), cascadeIndex, compareDepth);
    sum += uw2 * vw0 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u2, v0), cascadeIndex, compareDepth);

    sum += uw0 * vw1 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u0, v1), cascadeIndex, compareDepth);
    sum += uw1 * vw1 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u1, v1), cascadeIndex, compareDepth);
    sum += uw2 * vw1 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u2, v1), cascadeIndex, compareDepth);

    sum += uw0 * vw2 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u0, v2), cascadeIndex, compareDepth);
    sum += uw1 * vw2 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u1, v2), cascadeIndex, compareDepth);
    sum += uw2 * vw2 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, vec2<f32>(u2, v2), cascadeIndex, compareDepth);

    return sum * (1.0 / 144.0);
}

/**
 * 🌿 [식생(Foliage) 전용 적응형 CSM 섀도우 메인 함수]
 * - Cascade 0 (초근경): 언리얼 표준 9-Tap Optimized 5x5 Tent PCF로 지형(Landscape)과 나무 기둥/바위 접지부 반음영 품질 100% 일치
 * - Cascade 1+ (중원경): 초고속 1-Tap 하드웨어 Bilinear PCF로 대역폭 절감
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

    // 2. 뷰 깊이 산출 (고정밀 카메라 상대 좌표 기반)
    let relPos = worldPosition - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    let viewDepth = -viewPos.z;

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
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

    // 4. 식생 맞춤형 서브텍셀 슬로프 바이어스 및 노멀 오프셋
    let slopeBias = saturate(1.0 - nDotL);
    let normalBiasScale = 0.25 + slopeBias * 0.65;
    let baseBiasFactor = bias * (1.0 + slopeBias * 1.5);
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
    let driftBias = max(maxCoord * 0.00000035, 0.0001);
    let shadowDepth = saturate(shadowCoord.z);
    let cascadeBias = max(baseBiasFactor * (1.0 + f32(cascadeIndex) * 0.5) + driftBias, 0.0002 + driftBias);

    var finalVis: f32 = 1.0;

    // 5. 적응형 샘플링: 초근경(Cascade 0)은 언리얼 9-Tap 5x5 Tent PCF, 중원경(Cascade 1+)은 1-Tap 하드웨어 Bilinear PCF
    if (cascadeIndex == 0u) {
        finalVis = sampleShadowTent5x5Foliage(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            0u,
            shadowDepth - cascadeBias,
            texSize,
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

        if (viewDepth > blendStart && finalVis < 0.9999) {
            let nextIndex = cascadeIndex + 1u;
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextWorldTexelSize = shadowInfo.cascadeTexelSizes[nextIndex];
            let nextNormalOffset = N * normalBiasScale * nextWorldTexelSize;
            let nextBiasedPos = worldPosition + nextNormalOffset;
            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);

            let nextTUV = nextShadowCoord.xy;
            let nextShadowDepth = saturate(nextShadowCoord.z);
            let nextCascadeBias = max(baseBiasFactor * (1.0 + f32(nextIndex) * 0.5) + driftBias, 0.0002 + driftBias);

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
