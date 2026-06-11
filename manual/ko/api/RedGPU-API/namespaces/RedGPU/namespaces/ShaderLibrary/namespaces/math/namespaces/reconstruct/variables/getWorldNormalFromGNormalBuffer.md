[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldNormalFromGNormalBuffer

# Variable: getWorldNormalFromGNormalBuffer

> `const` **getWorldNormalFromGNormalBuffer**: `string` = `getWorldNormalFromGNormalBuffer_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:744](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L744)

G-Buffer의 RGB 데이터([0, 1] 범위)를 사용하여 월드 공간 법선 벡터([-1, 1] 범위)를 복구합니다.

//

## Param

G-Buffer에서 샘플링된 노멀 데이터
//

## Returns

복구된 월드 공간 법선 벡터

```wgsl
fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
    return normalize(gBufferNormal * 2.0 - 1.0);
}
```
