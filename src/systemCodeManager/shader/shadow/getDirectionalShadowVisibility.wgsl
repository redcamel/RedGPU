#redgpu_include shadow.getShadowCoord;

/**
 * 🌟 [수학적 최적화] 16-Tap Vogel Spiral (황금각 페르마 나선) 및 반경 기반 가우시안 텐트 가중치
 * - 중심부 가중치(1.0)에서 외곽(0.25)으로 부드럽게 감쇠하여 외곽선 링 밴딩을 100% 제거합니다.
 */
const VOGEL_DISK_16 = array<vec2<f32>, 16>(
    vec2<f32>( 0.176777,  0.000000), vec2<f32>(-0.226325,  0.207865),
    vec2<f32>( 0.038167, -0.393457), vec2<f32>( 0.280145,  0.378901),
    vec2<f32>(-0.470438, -0.247161), vec2<f32>( 0.407982, -0.420807),
    vec2<f32>(-0.091007,  0.629983), vec2<f32>(-0.320496, -0.603387),
    vec2<f32>( 0.655823,  0.316827), vec2<f32>(-0.684123,  0.347514),
    vec2<f32>( 0.354672, -0.726892), vec2<f32>( 0.198234,  0.822001),
    vec2<f32>(-0.710234, -0.523912), vec2<f32>( 0.852412, -0.334125),
    vec2<f32>(-0.540123,  0.778945), vec2<f32>(-0.082341, -0.977234)
);

// 중심거리 비례 가우시안 텐트 감쇠 가중치 (합계: 10.0)
const VOGEL_WEIGHTS_16 = array<f32, 16>(
    1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65,
    0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25
);
const TOTAL_VOGEL_WEIGHT: f32 = 10.0;

/**
 * 🌟 [단일 패스 언리얼 엔진 5 표준 16-Tap 안티앨리어싱 가우시안 텐트 PCF]
 */
fn sampleModernCascadeShadow(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    cascadeIndex: u32,
    shadowCoord: vec3<f32>,
    oneOverTextureSize: f32,
    bias: f32,
    lightSize: f32
) -> f32 {
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);
    let cascadeBias = bias * (1.0 + f32(cascadeIndex) * 0.25);

    // 🌟 [언리얼 엔진 표준 안티앨리어싱 필터 반경]
    let cascadeScale = mix(2.5, 3.2, clamp(f32(cascadeIndex) / 3.0, 0.0, 1.0));
    let filterRadius = oneOverTextureSize * cascadeScale * max(0.8, lightSize);

    var weightedVisibility: f32 = 0.0;

    // 16-Tap Vogel Spiral 가우시안 텐트 필터링을 조기 탈출 손실 없이 온전히 샘플링하여 부드러운 그러데이션 완성
    for (var i = 0; i < 16; i++) {
        let offset = VOGEL_DISK_16[i] * filterRadius;
        let tUV = shadowCoord.xy + offset;

        let sampleVisibility = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );

        let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
        let vis = select(sampleVisibility, 1.0, outOfBounds);
        weightedVisibility += vis * VOGEL_WEIGHTS_16[i];
    }

    let visibility = weightedVisibility / TOTAL_VOGEL_WEIGHT;
    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    return select(visibility, 1.0, invalidDepth);
}

/**
 * 🌟 [현대적인 완벽한 Clean Soft CSM 메인 진입점 - 언리얼 엔진 5 표준]
 *
 * @param directionalShadowMap [KO] 방향성 광원용 2D 뎁스 텍스처 어레이 [EN] 2D depth texture array for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param worldPosition [KO] 월드 공간 상의 정점/픽셀 좌표 [EN] World position of vertex/pixel
 * @param N [KO] 단위 법선 벡터 [EN] Unit normal vector
 * @param L [KO] 광원 방향 단위 벡터 [EN] Light direction unit vector
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibility(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>
) -> f32 {
    let nDotL = dot(N, L);
    // 🚀 1. 완전 역광(-0.08 미만)은 샘플링 스킵 (GPU 부하 절감)
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let bias = shadowInfo.directionalShadowBias;
    let lightSize = shadowInfo.pcssLightSize;

    // 2. 뷰 깊이 산출
    let viewPos = systemUniforms.camera.viewMatrix * vec4<f32>(worldPosition, 1.0);
    let viewDepth = -viewPos.z;

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
        return 1.0;
    }

    // 3. 캐스케이드 레벨 결정
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 🚀 4. [언리얼 엔진 표준 슬로프 스케일 노멀 바이어스]
    let slopeBias = clamp(1.0 - nDotL, 0.0, 1.0);
    var lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    var orthoScale = length(lightVP[0].xyz);
    var worldTexelSize = select(0.01, 2.0 / orthoScale, orthoScale > 0.0001) * oneOverTextureSize;
    var normalOffset = N * slopeBias * worldTexelSize * 1.0;
    var biasedWorldPosition = worldPosition + normalOffset;

    var shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

    // 🌟 [화면 모서리 원근 탈출(OOB) 자동 승격 방어망]
    if ((shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0) && cascadeIndex < cascadeCount - 1u) {
        cascadeIndex = cascadeIndex + 1u;
        lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
        orthoScale = length(lightVP[0].xyz);
        worldTexelSize = select(0.01, 2.0 / orthoScale, orthoScale > 0.0001) * oneOverTextureSize;
        normalOffset = N * slopeBias * worldTexelSize * 1.0;
        biasedWorldPosition = worldPosition + normalOffset;
        shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

        if ((shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0) && cascadeIndex < cascadeCount - 1u) {
            cascadeIndex = cascadeIndex + 1u;
            lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
            orthoScale = length(lightVP[0].xyz);
            worldTexelSize = select(0.01, 2.0 / orthoScale, orthoScale > 0.0001) * oneOverTextureSize;
            normalOffset = N * slopeBias * worldTexelSize * 1.0;
            biasedWorldPosition = worldPosition + normalOffset;
            shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);
        }
    }

    let visibility = sampleModernCascadeShadow(
        directionalShadowMap,
        directionalShadowMapSampler,
        cascadeIndex,
        shadowCoord,
        oneOverTextureSize,
        bias,
        lightSize
    );

    var finalVisibility = visibility;

    // 🌟 5. [언리얼 엔진 5 표준 캐스케이드 전환 블렌딩 (Cascade Transition Fraction = 0.20)]
    // 전환 구간에 들어선 모든 픽셀에서 다음 캐스케이드를 정확히 샘플링하여 부드러운 S자 크로스페이드 수행
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[cascadeIndex - 1u], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.20;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart) {
            let nextIndex = cascadeIndex + 1u;
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextOrthoScale = length(nextLightVP[0].xyz);
            let nextWorldTexelSize = select(0.01, 2.0 / nextOrthoScale, nextOrthoScale > 0.0001) * oneOverTextureSize;
            let nextBiasedPos = worldPosition + N * slopeBias * nextWorldTexelSize * 1.0;

            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);
            let nextVis = sampleModernCascadeShadow(
                directionalShadowMap,
                directionalShadowMapSampler,
                nextIndex,
                nextShadowCoord,
                oneOverTextureSize,
                bias,
                lightSize
            );

            let blendFactor = smoothstep(0.0, 1.0, clamp((viewDepth - blendStart) / blendMargin, 0.0, 1.0));
            finalVisibility = mix(visibility, nextVis, blendFactor);
        }
    } else {
        // 6. 최외곽 15% 부드러운 페이드아웃 (하드 컷오프 방지)
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, clamp((viewDepth - fadeStart) / (maxShadowDist - fadeStart), 0.0, 1.0));
            finalVisibility = mix(finalVisibility, 1.0, fadeFactor);
        }
    }

    // 🌟 [언리얼 엔진 표준 Soft Horizon Terminator Fade]
    // 빛과 표면이 90도에 가까운 경계에서 메쉬 삼각형 톱니 모서리가 노출되지 않도록 부드럽게 페이드아웃
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVisibility * horizonFade;
}
