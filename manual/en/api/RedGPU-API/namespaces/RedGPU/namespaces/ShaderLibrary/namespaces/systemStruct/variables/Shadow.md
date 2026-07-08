[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2406](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L2406)

Definition of the Shadow configuration structure.

```wgsl
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    directionalShadowFilterScale: f32
};
```
