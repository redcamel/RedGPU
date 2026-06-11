[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Time

# Variable: Time

> `const` **Time**: `string` = `Time_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2332](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L2332)

시간 관련 데이터 구조체 정의입니다.

```wgsl
struct Time {
    time: f32,
    deltaTime: f32,
    frameIndex: u32,
    sinTime: f32
};
```
