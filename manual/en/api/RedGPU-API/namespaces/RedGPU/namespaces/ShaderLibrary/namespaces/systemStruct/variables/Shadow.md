[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2484](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2484)

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
