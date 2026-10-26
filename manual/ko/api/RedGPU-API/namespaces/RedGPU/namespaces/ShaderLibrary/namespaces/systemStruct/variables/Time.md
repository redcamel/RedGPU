[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Time

# Variable: Time

> `const` **Time**: `string` = `Time_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2434](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2434)

시간 관련 데이터 구조체 정의입니다.

```wgsl
struct Time {
    time: f32,
    deltaTime: f32,
    frameIndex: u32,
    sinTime: f32
};
```
