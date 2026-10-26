[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2481](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2481)

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
