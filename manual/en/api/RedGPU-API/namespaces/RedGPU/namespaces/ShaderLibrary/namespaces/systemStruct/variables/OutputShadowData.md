[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputShadowData

# Variable: OutputShadowData

> `const` **OutputShadowData**: `string` = `OutputShadowData_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2378)

Definition of the OutputShadowData structure.

```wgsl
struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};
```
