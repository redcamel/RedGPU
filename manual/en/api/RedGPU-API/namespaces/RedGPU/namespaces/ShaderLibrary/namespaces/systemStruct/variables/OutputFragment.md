[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputFragment

# Variable: OutputFragment

> `const` **OutputFragment**: `string` = `OutputFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2264](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L2264)

Definition of the OutputFragment structure.

```wgsl
struct OutputFragment {
    @location(0) color: vec4<f32>,
    @location(1) gBufferNormal: vec4<f32>,
    @location(2) gBufferMotionVector: vec4<f32>,
}
```
