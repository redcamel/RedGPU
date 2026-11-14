[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldNormalFromGNormalBuffer

# Variable: getWorldNormalFromGNormalBuffer

> `const` **getWorldNormalFromGNormalBuffer**: `string` = `getWorldNormalFromGNormalBuffer_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:766](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L766)

Reconstructs world space normal vector ([-1, 1] range) from G-Buffer RGB data ([0, 1] range).

//

## Param

**gBufferNormal**

Normal data sampled from G-Buffer
//

## Returns

Reconstructed world space normal vector

```wgsl
fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
    return normalize(gBufferNormal * 2.0 - 1.0);
}
```
