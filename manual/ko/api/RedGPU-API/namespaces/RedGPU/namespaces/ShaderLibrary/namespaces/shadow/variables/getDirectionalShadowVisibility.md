[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getDirectionalShadowVisibility

# Variable: getDirectionalShadowVisibility

> `const` **getDirectionalShadowVisibility**: `string` = `getDirectionalShadowVisibility_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:995](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/systemCodeManager/ShaderLibrary.ts#L995)

방향성 광원의 그림자 가시성(Visibility)을 계산합니다.

//

## Param

방향성 광원용 깊이 텍스처
//

## Param

비교 샘플러
//

## Param

그림자 텍스처의 크기
//

## Param

그림자 바이어스
//

## Param

[0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값)
//

## Returns

가시성 계수 (0.0 ~ 1.0)

```wgsl
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

    return visibility;
}
```
