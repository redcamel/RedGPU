#redgpu_include shadow.getShadowCoord;

/**
 * [KO] Jorge Jimenez의 Interleaved Gradient Noise (IGN)
 * [EN] Jorge Jimenez's Interleaved Gradient Noise (IGN)
 */
fn interleavedGradientNoise(screenPos: vec2<f32>) -> f32 {
    let magic = vec3<f32>(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(screenPos, magic.xy)));
}

/**
 * [KO] 16-Tap Vogel Spiral (황금각 페르마 나선) 기반 단일 캐스케이드 가시성 샘플링
 * [EN] Single cascade shadow visibility sampling based on 16-Tap Vogel Spiral (Golden Angle Fermat's Spiral)
 */
fn sampleCascadeShadow(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    cascadeIndex: u32,
    shadowCoord: vec3<f32>,
    rotationMatrix: mat2x2<f32>,
    oneOverTextureSize: f32,
    bias: f32,
    filterScale: f32
) -> f32 {
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);

    // 🌟 [수학적 정석] 황금각(Golden Angle ≈ 137.5°) 기반 16-Tap Vogel Spiral 샘플 패턴
    var vogelDisk = array<vec2<f32>, 16>(
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

    // 캐스케이드 레벨에 비례하여 바이어스 및 필터 스케일 정규화
    let cascadeBias = bias * (1.0 + f32(cascadeIndex) * 0.4);
    let cascadeFilterScale = filterScale / (1.0 + f32(cascadeIndex) * 0.35);

    var visibility: f32 = 0.0;
    for (var i = 0; i < 16; i++) {
        let rotatedOffset = rotationMatrix * vogelDisk[i];
        let offset = rotatedOffset * oneOverTextureSize * cascadeFilterScale;
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
 * [KO] CSM(Cascaded Shadow Maps) 기반 방향성 광원 그림자 가시성을 계산합니다.
 * [EN] Calculates directional light shadow visibility based on CSM (Cascaded Shadow Maps).
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
    let filterScale = shadowInfo.directionalShadowFilterScale;

    // 1. 뷰 공간 z깊이(viewDepth) 산출
    let viewPos = systemUniforms.camera.viewMatrix * vec4<f32>(worldPosition, 1.0);
    let viewDepth = -viewPos.z;

    // 2. 화면 공간 스크린 좌표 기반 Interleaved Gradient Noise 회전 행렬 산출
    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPosition, 1.0);
    let screenPos = (clipPos.xy / max(clipPos.w, 1e-5) * 0.5 + 0.5) * systemUniforms.resolution;
    let randomAngle = interleavedGradientNoise(screenPos) * 6.28318530718;
    let cosAngle = cos(randomAngle);
    let sinAngle = sin(randomAngle);
    let rotationMatrix = mat2x2<f32>(cosAngle, -sinAngle, sinAngle, cosAngle);

    // 3. Cascade Index 결정
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 4. 주 캐스케이드 좌표 변환 및 샘플링
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    let shadowCoord = getShadowCoord(worldPosition, lightVP);
    let visibility = sampleCascadeShadow(
        directionalShadowMap,
        directionalShadowMapSampler,
        cascadeIndex,
        shadowCoord,
        rotationMatrix,
        oneOverTextureSize,
        bias,
        filterScale
    );

    // 5. 캐스케이드 경계 소프트 블렌딩 (다음 캐스케이드가 존재할 경우 전환 구간 5% 보간)
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[cascadeIndex - 1u], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.05;
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
                rotationMatrix,
                oneOverTextureSize,
                bias,
                filterScale
            );

            let blendFactor = clamp((viewDepth - blendStart) / blendMargin, 0.0, 1.0);
            return mix(visibility, nextVis, blendFactor);
        }
    }

    return visibility;
}
