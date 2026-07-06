[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / AmbientLight

# Variable: AmbientLight

> `const` **AmbientLight**: `string` = `AmbientLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2391](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L2391)

환경광(AmbientLight) 구조체 정의입니다.

```wgsl
struct AmbientLight {
	  color:vec3<f32>,
	  intensity:f32
};
```
