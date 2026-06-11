[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Shadow

# Variable: Shadow

> `const` **Shadow**: `string` = `Shadow_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2373](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L2373)

그림자(Shadow) 설정 구조체 정의입니다.

```wgsl
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    padding: vec2<f32> // 16바이트 정렬을 위한 패딩
};
```
