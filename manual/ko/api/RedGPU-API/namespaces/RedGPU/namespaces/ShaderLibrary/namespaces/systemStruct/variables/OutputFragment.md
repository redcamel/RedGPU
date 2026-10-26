[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputFragment

# Variable: OutputFragment

> `const` **OutputFragment**: `string` = `OutputFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2366](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2366)

프래그먼트 출력(OutputFragment) 구조체 정의입니다.

```wgsl
struct OutputFragment {
    @location(0) color: vec4<f32>,
    @location(1) gBufferNormal: vec4<f32>,
    @location(2) gBufferMotionVector: vec4<f32>,
}
```
