/**
 * [KO] 방향성 광원의 그림자 가시성(Visibility)을 계산합니다.
 * [EN] Calculates the shadow visibility for a directional light.
 *
 * @param directionalShadowMap -
 * [KO] 방향성 광원용 깊이 텍스처
 * [EN] Depth texture for directional light
 * @param directionalShadowMapSampler -
 * [KO] 비교 샘플러
 * [EN] Comparison sampler
 * @param shadowDepthTextureSize -
 * [KO] 그림자 텍스처의 크기
 * [EN] Size of the shadow texture
 * @param bias -
 * [KO] 그림자 바이어스
 * [EN] Shadow bias
 * @param shadowCoord -
 * [KO] [0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값)
 * [EN] Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
 * @returns
 * [KO] 가시성 계수 (0.0 ~ 1.0)
 * [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibility(
   directionalShadowMap: texture_depth_2d,
   directionalShadowMapSampler: sampler_comparison,
   shadowDepthTextureSize: u32,
   bias: f32,
   shadowCoord: vec3<f32>
) -> f32 {
    let oneOverShadowDepthTextureSize = 1.0 / f32(shadowDepthTextureSize);
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);

    var visibility: f32 = 0.0;

    // 3x3 PCF 필터링 적용 (Apply 3x3 PCF filtering)
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let offset = vec2f(vec2(x, y)) * oneOverShadowDepthTextureSize;
            let tUV = shadowCoord.xy + offset;

            let sampleVisibility = textureSampleCompare(
                directionalShadowMap,
                directionalShadowMapSampler,
                tUV,
                shadowDepth - bias
            );

            // 텍스처 범위를 벗어난 경우 그림자가 없는 것으로 처리 (Visibility 1.0)
            if (tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0) {
                visibility += 1.0;
            } else {
                visibility += sampleVisibility;
            }
        }
    }

    visibility /= 9.0;

    // 거리에 따른 최소 가시성 보정 (Legacy logic preserved)
    let depthFactor = shadowDepth;
    let minVisibility = 0.2 + depthFactor * 0.6;

    return max(visibility, minVisibility);
}
