[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / OutputShadowData

# Variable: OutputShadowData

> `const` **OutputShadowData**: `string` = `OutputShadowData_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2308](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L2308)

그림자 맵 데이터 출력(OutputShadowData) 구조체 정의입니다.

```wgsl
struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};
```
