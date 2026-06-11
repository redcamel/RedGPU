[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getDirectionalShadowVisibility

# Variable: getDirectionalShadowVisibility

> `const` **getDirectionalShadowVisibility**: `string` = `getDirectionalShadowVisibility_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:995](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L995)

Calculates the shadow visibility for a directional light.

//

## Param

Depth texture for directional light
//

## Param

Comparison sampler
//

## Param

Size of the shadow texture
//

## Param

Shadow bias
//

## Param

Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
//

## Returns

Visibility factor (0.0 ~ 1.0)

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
