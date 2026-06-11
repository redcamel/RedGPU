[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2373](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L2373)

Definition of the Shadow configuration structure.

```wgsl
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    padding: vec2<f32> // Padding for 16-byte alignment
};
```
