[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Time

# Variable: Time

> `const` **Time**: `string` = `Time_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2437](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/systemCodeManager/ShaderLibrary.ts#L2437)

Definition of the time-related data structure.

```wgsl
struct Time {
    time: f32,
    deltaTime: f32,
    frameIndex: u32,
    sinTime: f32
};
```
