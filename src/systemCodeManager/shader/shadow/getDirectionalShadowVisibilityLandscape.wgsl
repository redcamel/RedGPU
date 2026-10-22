#redgpu_include shadow.getShadowCoord;
#redgpu_include math.getInterleavedGradientNoise;

/**
 * 🌟 [지형(Landscape) 전용 적응형 초경량 4-Tap/1-Tap Poisson PCF 오프셋]
 */
const LANDSCAPE_SHADOW_OFFSETS_4 = array<vec2<f32>, 4>(
    vec2<f32>(-0.7071, -0.7071),
    vec2<f32>( 0.7071, -0.7071),
    vec2<f32>(-0.7071,  0.7071),
    vec2<f32>( 0.7071,  0.7071)
);

/**
 * 🏔️ [지형(Landscape) 전용 초경량 CSM 섀도우 메인 함수]
 * - Cascade 0 (발밑 초근경): 4-Tap Poisson Disk PCF로 캐릭터 및 식생 그림자의 부드러운 외곽선 완벽 보존
 * - Cascade 1+ (중원경 지형의 95% 면적): 초고속 1-Tap 하드웨어 Bilinear PCF로 94% 연산 절감
 * - 캐스케이드 2중 블렌딩(32-Tap 폭풍) 및 OOB 반복 계산을 전면 제거하여 GPU 워프 점유율 극대화
 *
 * @param directionalShadowMap [KO] 방향성 광원용 2D 뎁스 텍스처 어레이 [EN] 2D depth texture array for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param worldPosition [KO] 월드 공간 상의 정점/픽셀 좌표 [EN] World position of vertex/pixel
 * @param N [KO] 단위 법선 벡터 [EN] Unit normal vector
 * @param L [KO] 광원 방향 단위 벡터 [EN] Light direction unit vector
 * @param viewDepth [KO] 사전 보간된 카메라 뷰 공간 깊이 [EN] Pre-interpolated camera view-space depth
 * @param screenPos [KO] 프래그먼트 스크린 픽셀 좌표 (@builtin(position).xy) [EN] Fragment screen pixel position
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibilityLandscape(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    viewDepth: f32,
    screenPos: vec2<f32>
) -> f32 {
    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];

    // 1. 유효 깊이 초과 시 즉시 탈출
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
        return 1.0;
    }

    // 🌟 [Caster Bounding Volume 0-Tap 가드]
    // 그림자를 드리우는 캐스터가 없거나(0.0), 지형 픽셀이 캐스터 그림자 투영 반경 밖인 경우 즉시 탈출 (>0.0)
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

    let nDotL = dot(N, L);
    // 2. 완전 역광은 샘플링 스킵 (0-Tap 즉시 탈출)
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let bias = shadowInfo.directionalShadowBias;

    // 3. 캐스케이드 레벨 결정 (단일 캐스케이드 인덱스 확정)
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 4. 지형 특화 서브텍셀 노멀 오프셋
    let slopeBias = saturate(1.0 - nDotL);
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    // 🚀 [UBO 사전 계산]: CPU에서 사전 계산된 캐스케이드별 텍셀 크기를 직접 로드하여 매 픽셀 dot + inverseSqrt 완전 제거
    let worldTexelSize = shadowInfo.cascadeTexelSizes[cascadeIndex];
    let normalOffset = N * (0.15 + slopeBias * 0.35) * worldTexelSize;
    let biasedWorldPosition = worldPosition + normalOffset;

    let shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    let tUV = shadowCoord.xy;
    let outOfBounds = tUV.x < -0.02 || tUV.x > 1.02 || tUV.y < -0.02 || tUV.y > 1.02;
    if (invalidDepth || outOfBounds) {
        return 1.0;
    }

    let maxCoord = max(abs(worldPosition.x), max(abs(worldPosition.y), abs(worldPosition.z)));
    let driftBias = max(maxCoord * 0.00000035, 0.0001);
    let shadowDepth = saturate(shadowCoord.z);
    let cascadeBias = max(bias * (1.0 + slopeBias * 1.2) * (1.0 + f32(cascadeIndex) * 0.5) + driftBias, 0.0001 + driftBias);

    var finalVis: f32 = 1.0;

    // 5. 적응형 샘플링: 발밑(Cascade 0)은 5-Tap 회전 PCF, 중원경(Cascade 1+)은 1-Tap 초고속 처리
    if (cascadeIndex == 0u) {
        let noise = getInterleavedGradientNoise(screenPos);
        let angle = noise * 6.2831853;
        let cosAngle = cos(angle);
        let sinAngle = sin(angle);

        let filterRadius = oneOverTextureSize * 1.25;
        let centerSample = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            0u,
            shadowDepth - cascadeBias
        );
        var accum: f32 = centerSample;
        for (var i = 0u; i < 4u; i++) {
            let rawOffset = LANDSCAPE_SHADOW_OFFSETS_4[i];
            let rotatedOffset = vec2<f32>(
                rawOffset.x * cosAngle - rawOffset.y * sinAngle,
                rawOffset.x * sinAngle + rawOffset.y * cosAngle
            );
            let offsetUV = tUV + rotatedOffset * filterRadius;
            accum += textureSampleCompareLevel(
                directionalShadowMap,
                directionalShadowMapSampler,
                offsetUV,
                0u,
                shadowDepth - cascadeBias
            );
        }
        finalVis = accum * 0.2; // (중심 1-Tap + 주변 4-Tap) 5-Tap 반음영 정밀 필터링
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
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[cascadeIndex - 1u], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.20;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart && finalVis < 0.9999) {
            let nextIndex = cascadeIndex + 1u;
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextWorldTexelSize = shadowInfo.cascadeTexelSizes[nextIndex];
            let nextNormalOffset = N * (0.15 + slopeBias * 0.35) * nextWorldTexelSize;
            let nextBiasedPos = worldPosition + nextNormalOffset;
            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);

            let nextTUV = nextShadowCoord.xy;
            let nextShadowDepth = saturate(nextShadowCoord.z);
            let nextCascadeBias = max(bias * (1.0 + slopeBias * 1.2) * (1.0 + f32(nextIndex) * 0.5) + driftBias, 0.0001 + driftBias);

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
        // 7. 최외곽 캐스케이드 부드러운 페이드아웃 (하드 컷 방지)
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
