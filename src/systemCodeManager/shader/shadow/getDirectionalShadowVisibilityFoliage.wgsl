#redgpu_include shadow.getShadowCoord;

const FOLIAGE_SHADOW_CROSS_4 = array<vec2<f32>, 4>(
    vec2<f32>( 0.0,  0.8),
    vec2<f32>( 0.0, -0.8),
    vec2<f32>(-0.8,  0.0),
    vec2<f32>( 0.8,  0.0)
);

/**
 * 🌿 [식생(Foliage) 전용 초경량 CSM 섀도우 메인 함수]
 * - 캐스케이드 전환 블렌딩 스킵 (2중 샘플링 폭풍 차단 및 경계선 스터터링 100% 방지)
 * - Cascade 0: 4-Tap Cross PCF (하드웨어 2x2 바이리니어 PCF와 결합되어 실질적 16텍셀 품질 유지)
 * - Cascade 1+: 1-Tap 하드웨어 Bilinear PCF (초고속 단일 샘플링)
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

    var finalVis: f32 = 1.0;

    // 5. Cascade 레벨별 가변 샘플링
    if (cascadeIndex == 0u) {
        // Cascade 0: 4-Tap Cross PCF
        let filterRadius = oneOverTextureSize * 2.0;
        var vis: f32 = 0.0;
        for (var i = 0u; i < 4u; i++) {
            let sampleUV = tUV + FOLIAGE_SHADOW_CROSS_4[i] * filterRadius;
            vis += textureSampleCompareLevel(
                directionalShadowMap,
                directionalShadowMapSampler,
                sampleUV,
                0u,
                shadowDepth - cascadeBias
            );
        }
        finalVis = vis * 0.25;
    } else {
        // Cascade 1, 2, 3: 1-Tap 하드웨어 Bilinear PCF
        finalVis = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );
    }

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
