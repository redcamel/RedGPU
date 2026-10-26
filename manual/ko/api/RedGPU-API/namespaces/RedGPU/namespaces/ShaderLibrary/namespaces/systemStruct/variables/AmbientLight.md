[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / AmbientLight

# Variable: AmbientLight

> `const` **AmbientLight**: `string` = `AmbientLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2461)

환경광(AmbientLight) 구조체 정의입니다.

```wgsl
struct AmbientLight {
	  color:vec3<f32>,
	  intensity:f32
};
```
