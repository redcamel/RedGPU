[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getDirectionalShadowVisibilityLandscape

# Variable: getDirectionalShadowVisibilityLandscape

> `const` **getDirectionalShadowVisibilityLandscape**: `string` = `getDirectionalShadowVisibilityLandscape_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1414](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L1414)

// 🌟 [지형(Landscape) 초근경(Cascade 0) 전용 비회전 12-Tap 등방성 원형 가우시안 디스크]
// - 일반 메쉬(sampleShadowIsotropic12Mesh)의 Cascade 0과 100% 동일한 오프셋 및 가중치를 공유하여
//   메쉬-지형 접점의 반음영 두께와 농도를 완벽히 일치시킵니다.

```wgsl
#redgpu_include shadow.getShadowCoord;

fn sampleShadowIsotropic12Landscape(
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

    // 2. 내측 5각 비격자 링 (Radius: 0.90 * s, Weight: 2.4 each -> 12.0)
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.8559,  0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.2781,  0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>(-0.8559, -0.2781) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.2781, -0.8559) * s, cascadeIndex, compareDepth);
    sum += 2.4 * textureSampleCompareLevel(directionalShadowMap, directionalShadowMapSampler, tUV + vec2<f32>( 0.5871, -0.6836) * s, cascadeIndex, compareDepth);

    // 3. 외측 6각 회전 링 (Radius: 1.75 * s, Weight: 1.0 each -> 6.0)
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
 * 🌟 [지형(Landscape) 중·원경 전용 4-Tap 26.6° Rotated-Grid PCF]
 * - RGSS (arctan(0.5) ≈ 26.6°) 배치로 4개의 하드웨어 2x2 Bilinear 탭이 서로 다른 가로·세로 축을 샘플링하여
 *   기존 9-Tap 5x5 Tent 대비 텍스처 대역폭을 55.6% 절감하고 나눗셈(fdiv)을 100% 제거합니다.
 *
 */
fn sampleShadowRotatedGrid4Landscape(
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
 * 🏔️ [지형(Landscape) 전용 적응형 CSM 메인 진입점]
 * - Cascade 0: 12-Tap 비회전 등방성 원형 가우시안 디스크 (일반 메쉬와 100% 일치)
 * - Cascade 1 ~ 3: 4-Tap 26.6° Rotated-Grid PCF (계단 윤곽 제거 및 원경 대역폭 66.7% 절감)
 * - 정점 셰이더(landscapeVertex.wgsl)에서 계산된 구면 viewDepth를 전달받아 픽셀당 행렬 곱셈 생략
 *
 * @param directionalShadowMap 2D depth texture array for directional light
 * @param directionalShadowMapSampler Comparison sampler
 * @param worldPosition World position of pixel
 * @param N Unit normal vector
 * @param L Light direction unit vector
 * @param viewDepth Interpolated camera distance
 * @returns Visibility factor (0.0 ~ 1.0)
 *
 */
fn getDirectionalShadowVisibilityLandscape(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    viewDepth: f32
) -> f32 {
    let nDotL = dot(N, L);
    // 1. 완전 역광(-0.08 미만)은 샘플링 스킵
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
        return 1.0;
    }

    // 2. [Caster Bounding Volume 0-Tap 가드]
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

    // 4. 일반 메쉬(getDirectionalShadowVisibility)와 100% 동일한 서브텍셀 노멀 오프셋 및 적응형 깊이 바이어스
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

    let maxCoord = max(abs(worldPosition.x), max(abs(worldPosition.y), abs(worldPosition.z)));
    let driftBias = maxCoord * 0.00000025;
    let shadowDepth = saturate(shadowCoord.z);
    let cascadeBias = rawBaseBiasFactor * cascadeAtten + driftBias;
    let compareDepth = shadowDepth - cascadeBias;

    // 5. 캐스케이드 거리별 차등 탭 샘플링 (12 / 4 / 4 / 4)
    var finalVisibility: f32 = 1.0;
    if (cascadeIndex == 0u) {
        finalVisibility = sampleShadowIsotropic12Landscape(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            0u,
            compareDepth,
            oneOverTextureSize
        );
    } else {
        finalVisibility = sampleShadowRotatedGrid4Landscape(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            compareDepth,
            oneOverTextureSize
        );
    }

    // 6. 캐스케이드 전환 블렌딩 (하위 20% 구간: 4-Tap Rotated-Grid 크로스페이드)
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
                let nextCompareDepth = nextShadowDepth - nextCascadeBias;

                let nextVis = sampleShadowRotatedGrid4Landscape(
                    directionalShadowMap,
                    directionalShadowMapSampler,
                    nextTUV,
                    nextIndex,
                    nextCompareDepth,
                    oneOverTextureSize
                );

                let blendFactor = smoothstep(0.0, 1.0, saturate((viewDepth - blendStart) / blendMargin));
                finalVisibility = mix(finalVisibility, nextVis, blendFactor);
            }
        }
    } else {
        // 7. 최외곽 15% 부드러운 페이드아웃
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, saturate((viewDepth - fadeStart) / (maxShadowDist - fadeStart)));
            finalVisibility = mix(finalVisibility, 1.0, fadeFactor);
        }
    }

    // 8. Soft Horizon Terminator Fade
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVisibility * horizonFade;
}
```
