#redgpu_include shadow.getShadowCoord;

/**
 * 🌿 [식생(Foliage) 전용 초경량 1-Tap CSM 섀도우 메인 함수]
 * - 캐스케이드 전환 블렌딩 스킵 (2중 샘플링 폭풍 차단 및 경계선 스터터링 100% 방지)
 * - 전 캐스케이드 초고속 1-Tap 하드웨어 Bilinear PCF 단일화
 * - 풀잎 자체의 고주파 지오메트리 요철로 인해 1-Tap만으로도 완벽한 소프트 섀도우 구현
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
    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let bias = shadowInfo.directionalShadowBias;

    // 2. 뷰 깊이 산출
    let viewPos = systemUniforms.camera.viewMatrix * vec4<f32>(worldPosition, 1.0);
    let viewDepth = -viewPos.z;

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
        return 1.0;
    }

    // 3. 캐스케이드 레벨 결정 (단일 캐스케이드만 선택)
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 4. 경량 슬로프 바이어스 및 노멀 오프셋
    let slopeBias = clamp(1.0 - nDotL, 0.0, 1.0);
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    let orthoScale = length(lightVP[0].xyz);
    let worldTexelSize = select(0.01, 2.0 / orthoScale, orthoScale > 0.0001) * oneOverTextureSize;
    let normalOffset = N * (0.6 + slopeBias * 1.5) * worldTexelSize;
    let biasedWorldPosition = worldPosition + normalOffset;

    let shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    let tUV = shadowCoord.xy;
    let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
    if (invalidDepth || outOfBounds) {
        return 1.0;
    }

    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);
    let cascadeBias = bias * (1.0 + slopeBias * 1.5) * (1.0 + f32(cascadeIndex) * 0.25);

    // 5. 초경량 1-Tap 하드웨어 Bilinear PCF (식생/풀잎 자체 요철로 1-Tap만으로도 완벽한 소프트 섀도우 연출)
    var finalVis = textureSampleCompareLevel(
        directionalShadowMap,
        directionalShadowMapSampler,
        tUV,
        cascadeIndex,
        shadowDepth - cascadeBias
    );

    // 6. 최외곽 캐스케이드 부드러운 페이드아웃
    if (cascadeIndex == cascadeCount - 1u) {
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, clamp((viewDepth - fadeStart) / (maxShadowDist - fadeStart), 0.0, 1.0));
            finalVis = mix(finalVis, 1.0, fadeFactor);
        }
    }

    // 7. Soft Horizon Terminator Fade
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVis * horizonFade;
}
