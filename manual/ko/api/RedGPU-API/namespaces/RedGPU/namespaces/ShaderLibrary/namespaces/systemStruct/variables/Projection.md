[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Projection

# Variable: Projection

> `const` **Projection**: `string` = `Projection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2422](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2422)

투영(Projection) 관련 행렬 구조체 정의입니다.

```wgsl
struct Projection {
    projectionMatrix: mat4x4<f32>,
    projectionViewMatrix: mat4x4<f32>,
    noneJitterProjectionMatrix: mat4x4<f32>,
    noneJitterProjectionViewMatrix: mat4x4<f32>,
    inverseProjectionMatrix: mat4x4<f32>,
    inverseProjectionViewMatrix: mat4x4<f32>,
    prevNoneJitterProjectionViewMatrix: mat4x4<f32>
};
```
