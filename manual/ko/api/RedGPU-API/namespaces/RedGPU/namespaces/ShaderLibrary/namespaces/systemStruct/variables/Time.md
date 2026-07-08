[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Time

# Variable: Time

> `const` **Time**: `string` = `Time_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2364](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L2364)

시간 관련 데이터 구조체 정의입니다.

```wgsl
struct Time {
    time: f32,
    deltaTime: f32,
    frameIndex: u32,
    sinTime: f32
};
```
