[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2484](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L2484)

Definition of the Cascaded Shadow Maps (CSM) configuration structure.

```wgsl
struct Shadow {
    cascadeLightViewProjectionMatrices: array<mat4x4<f32>, 4>,
    cascadeSplitDepths: vec4<f32>,
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    cascadeCount: u32,
    cascadeTexelSizes: vec4<f32>,
    casterBoundingCenter: vec3<f32>,
    casterBoundingRadiusSq: f32,
};
```
