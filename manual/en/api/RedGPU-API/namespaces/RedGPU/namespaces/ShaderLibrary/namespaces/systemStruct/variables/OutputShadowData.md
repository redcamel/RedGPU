[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputShadowData

# Variable: OutputShadowData

> `const` **OutputShadowData**: `string` = `OutputShadowData_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2276](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L2276)

Definition of the OutputShadowData structure.

```wgsl
struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};
```
