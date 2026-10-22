#redgpu_include shadow.getShadowCoord;

/**
 * 🌿 [식생(Foliage) 전용 적응형 CSM 섀도우 메인 함수]
 * - Cascade 0 (초근경): 회전 지터 없는 대칭 5-Tap Tent PCF로 지형(Landscape)과 나무 기둥/바위 접지부 그림자 품질 100% 일치
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

    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
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

    // 5. 적응형 샘플링: 초근경(Cascade 0)은 대칭 5-Tap Tent PCF, 중원경(Cascade 1+)은 1-Tap 하드웨어 Bilinear PCF
    if (cascadeIndex == 0u) {
        let stepUV = oneOverTextureSize * 0.75;
        let compareDepth = shadowDepth - cascadeBias;
        let centerSample = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            0u,
            compareDepth
        );
        let s0 = textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-stepUV, -stepUV), 0u, compareDepth);
        let s1 = textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( stepUV, -stepUV), 0u, compareDepth);
        let s2 = textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-stepUV,  stepUV), 0u, compareDepth);
        let s3 = textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( stepUV,  stepUV), 0u, compareDepth);
        finalVis = centerSample * 0.28 + (s0 + s1 + s2 + s3) * 0.18;
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
    // 🚀 Cascade 0 -> 1 등 경계선 구간에서 하드 컷 직선을 완전히 소거하고 부드럽게 크로스페이드
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
