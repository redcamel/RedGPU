[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / AmbientLight

# Variable: AmbientLight

> `const` **AmbientLight**: `string` = `AmbientLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2464](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2464)

환경광(AmbientLight) 구조체 정의입니다.

```wgsl
struct AmbientLight {
	  color:vec3<f32>,
	  intensity:f32
};
```
