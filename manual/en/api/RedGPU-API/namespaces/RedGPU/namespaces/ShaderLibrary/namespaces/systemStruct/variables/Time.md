[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Time

# Variable: Time

> `const` **Time**: `string` = `Time_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2332](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L2332)

Definition of the time-related data structure.

```wgsl
struct Time {
    time: f32,
    deltaTime: f32,
    frameIndex: u32,
    sinTime: f32
};
```
