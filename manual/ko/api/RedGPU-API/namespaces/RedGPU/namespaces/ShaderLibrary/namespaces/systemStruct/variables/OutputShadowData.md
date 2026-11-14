[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputShadowData

# Variable: OutputShadowData

> `const` **OutputShadowData**: `string` = `OutputShadowData_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2381](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L2381)

그림자 맵 데이터 출력(OutputShadowData) 구조체 정의입니다.

```wgsl
struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};
```
