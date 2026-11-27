[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputFragment

# Variable: OutputFragment

> `const` **OutputFragment**: `string` = `OutputFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2369](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2369)

Definition of the OutputFragment structure.

```wgsl
struct OutputFragment {
    @location(0) color: vec4<f32>,
    @location(1) gBufferNormal: vec4<f32>,
    @location(2) gBufferMotionVector: vec2<f32>,
}
```
