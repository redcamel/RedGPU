[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldNormalFromGNormalBuffer

# Variable: getWorldNormalFromGNormalBuffer

> `const` **getWorldNormalFromGNormalBuffer**: `string` = `getWorldNormalFromGNormalBuffer_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:746](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L746)

Reconstructs world space normal vector ([-1, 1] range) from G-Buffer RGB data ([0, 1] range).

//

## Param

Normal data sampled from G-Buffer
//

## Returns

Reconstructed world space normal vector

```wgsl
fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
    return normalize(gBufferNormal * 2.0 - 1.0);
}
```
