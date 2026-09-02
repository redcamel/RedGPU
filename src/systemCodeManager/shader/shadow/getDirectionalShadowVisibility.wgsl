#redgpu_include shadow.getShadowCoord;

/**
 * [KO] 16-Tap Vogel Spiral (황금각 페르마 나선) 샘플 패턴 (수학적 균등 분포)
 * [EN] 16-Tap Vogel Spiral (Golden Angle Fermat's Spiral) sample pattern
 */
const VOGEL_DISK = array<vec2<f32>, 16>(
    vec2<f32>( 0.176777,  0.000000),
    vec2<f32>(-0.226325,  0.207865),
    vec2<f32>( 0.038167, -0.393457),
    vec2<f32>( 0.280145,  0.378901),
    vec2<f32>(-0.470438, -0.247161),
    vec2<f32>( 0.407982, -0.420807),
    vec2<f32>(-0.091007,  0.629983),
    vec2<f32>(-0.320496, -0.603387),
    vec2<f32>( 0.655823,  0.316827),
    vec2<f32>(-0.684123,  0.347514),
    vec2<f32>( 0.354672, -0.726892),
    vec2<f32>( 0.198234,  0.822001),
    vec2<f32>(-0.710234, -0.523912),
    vec2<f32>( 0.852412, -0.334125),
    vec2<f32>(-0.540123,  0.778945),
    vec2<f32>(-0.082341, -0.977234)
);

/**
 * [KO] 8-Tap Blocker Search (차폐체 탐색 및 접촉 경화 가변 펜엄브라 크기 계산)
 */
fn findBlockerPenumbraScale(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    cascadeIndex: u32,
    shadowCoord: vec3<f32>,
    oneOverTextureSize: f32,
    cascadeBias: f32,
    lightSize: f32
) -> f32 {
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);
    let cascadeSearchScale = 1.0 / (1.0 + f32(cascadeIndex) * 0.7);
    let searchRadius = oneOverTextureSize * max(1.0, lightSize * 2.0) * cascadeSearchScale;

    var blockerCount: f32 = 0.0;

    // 8-Tap Blocker Sampling
    for (var i = 0; i < 8; i++) {
        let sampleUV = shadowCoord.xy + VOGEL_DISK[i * 2] * searchRadius;
        let sampleVis = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            sampleUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );
        blockerCount += (1.0 - sampleVis);
    }

    let blockerRatio = blockerCount / 8.0;
    if (blockerRatio <= 0.0) {
        return 0.0; // 차폐체 없음
    }

    // 접촉 경화(Contact Hardening): 노이즈 없이 부드러운 전이 곡선 적용
    let penumbraFactor = mix(0.5, 2.2, smoothstep(0.0, 1.0, blockerRatio));
    let baseFilterScale = 1.0 / (1.0 + f32(cascadeIndex) * 0.4);
    return baseFilterScale * lightSize * 0.7 * penumbraFactor;
}

/**
 * [KO] 노이즈 프리(Noise-Free) 16-Tap Vogel Spiral 기반 단일 캐스케이드 가시성 샘플링
 */
fn sampleCascadeShadow(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    cascadeIndex: u32,
    shadowCoord: vec3<f32>,
    oneOverTextureSize: f32,
    bias: f32,
    lightSize: f32
) -> f32 {
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);
    let cascadeBias = bias * (1.0 + f32(cascadeIndex) * 0.4);

    // PCSS 접촉 경화 가변 펜엄브라 스케일 산출
    let effectiveFilterScale = findBlockerPenumbraScale(
        directionalShadowMap,
        directionalShadowMapSampler,
        cascadeIndex,
        shadowCoord,
        oneOverTextureSize,
        cascadeBias,
        lightSize
    );

    if (effectiveFilterScale <= 0.0) {
        return 1.0;
    }

    var visibility: f32 = 0.0;
    // 🌟 [노이즈 프리 정렬 16-Tap Vogel PCSS] 인접 픽셀 간 완벽한 연속성으로 지글거림 0 달성
    for (var i = 0; i < 16; i++) {
        let offset = VOGEL_DISK[i] * oneOverTextureSize * effectiveFilterScale;
        let tUV = shadowCoord.xy + offset;

        let sampleVisibility = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );

        let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
        visibility += select(sampleVisibility, 1.0, outOfBounds);
    }

    visibility /= 16.0;
    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    return select(visibility, 1.0, invalidDepth);
}

/**
 * [KO] CSM 및 PCSS 기반 방향성 광원 그림자 가시성을 계산합니다.
 * [EN] Calculates directional light shadow visibility based on CSM and PCSS.
 *
 * @param directionalShadowMap [KO] 방향성 광원용 2D 뎁스 텍스처 어레이 [EN] 2D depth texture array for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param worldPosition [KO] 월드 공간 상의 정점/픽셀 좌표 [EN] World position of vertex/pixel
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibility(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>
) -> f32 {
    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let bias = shadowInfo.directionalShadowBias;
    let lightSize = shadowInfo.pcssLightSize;

    // 1. 뷰 공간 z깊이(viewDepth) 산출
    let viewPos = systemUniforms.camera.viewMatrix * vec4<f32>(worldPosition, 1.0);
    let viewDepth = -viewPos.z;

    // 2. Cascade Index 결정
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 3. 주 캐스케이드 좌표 변환 및 노이즈 프리 PCSS 샘플링 수행
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    let shadowCoord = getShadowCoord(worldPosition, lightVP);
    let visibility = sampleCascadeShadow(
        directionalShadowMap,
        directionalShadowMapSampler,
        cascadeIndex,
        shadowCoord,
        oneOverTextureSize,
        bias,
        lightSize
    );

    // 4. 캐스케이드 경계 소프트 블렌딩 (다음 캐스케이드가 존재할 경우 전환 구간 10% 보간 - UE5 표준)
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[cascadeIndex - 1u], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.1;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart) {
            let nextIndex = cascadeIndex + 1u;
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextShadowCoord = getShadowCoord(worldPosition, nextLightVP);
            let nextVis = sampleCascadeShadow(
                directionalShadowMap,
                directionalShadowMapSampler,
                nextIndex,
                nextShadowCoord,
                oneOverTextureSize,
                bias,
                lightSize
            );

            let blendFactor = clamp((viewDepth - blendStart) / blendMargin, 0.0, 1.0);
            return mix(visibility, nextVis, blendFactor);
        }
    }

    return visibility;
}
