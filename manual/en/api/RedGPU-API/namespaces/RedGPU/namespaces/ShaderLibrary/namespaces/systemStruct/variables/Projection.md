[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Projection

# Variable: Projection

> `const` **Projection**: `string` = `Projection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2317](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L2317)

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
