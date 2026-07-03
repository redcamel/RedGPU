/**
 * [KO] 방향성 광원의 그림자 가시성(Visibility)을 계산합니다.
 * [EN] Calculates the shadow visibility for a directional light.
 *
 * @param directionalShadowMap [KO] 방향성 광원용 깊이 텍스처 [EN] Depth texture for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param shadowDepthTextureSize [KO] 그림자 텍스처의 크기 [EN] Size of the shadow texture
 * @param bias [KO] 그림자 바이어스 [EN] Shadow bias
 * @param shadowCoord [KO] [0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값) [EN] Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
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
            let offset = vec2<f32>(f32(x), f32(y)) * oneOverShadowDepthTextureSize;
            let tUV = shadowCoord.xy + offset;

            // textureSampleCompare는 분기문 내부가 아닌, 항상 실행되는 영역(Uniform Control Flow)에 두어야 컴파일러 에러가 발생하지 않습니다.
            let sampleVisibility = textureSampleCompare(
                directionalShadowMap,
                directionalShadowMapSampler,
                tUV,
                shadowDepth - bias
            );

            // 범위 밖의 영역은 그림자 가시성을 1.0으로 고정 (select 함수를 사용하여 분기를 피함)
            let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
            visibility += select(sampleVisibility, 1.0, outOfBounds);
        }
    }

    visibility /= 9.0;

    // 라이트 프러스트럼 범위 밖(Near/Far plane 너머)인 경우 분기문 없이 select로 1.0 반환 처리
    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    return select(visibility, 1.0, invalidDepth);
}
