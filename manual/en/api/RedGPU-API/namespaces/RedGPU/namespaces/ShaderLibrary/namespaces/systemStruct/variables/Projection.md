[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Projection

# Variable: Projection

> `const` **Projection**: `string` = `Projection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2422](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/systemCodeManager/ShaderLibrary.ts#L2422)

Definition of the Projection-related matrices structure.

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
