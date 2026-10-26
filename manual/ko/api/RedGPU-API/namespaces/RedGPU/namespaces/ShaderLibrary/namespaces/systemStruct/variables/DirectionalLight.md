[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / DirectionalLight

# Variable: DirectionalLight

> `const` **DirectionalLight**: `string` = `DirectionalLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2448](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2448)

직사광(DirectionalLight) 구조체 정의입니다.

```wgsl
struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
```
