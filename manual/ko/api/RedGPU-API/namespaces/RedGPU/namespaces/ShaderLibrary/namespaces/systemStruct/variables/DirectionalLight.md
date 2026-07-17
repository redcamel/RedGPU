[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / DirectionalLight

# Variable: DirectionalLight

> `const` **DirectionalLight**: `string` = `DirectionalLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2378](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L2378)

직사광(DirectionalLight) 구조체 정의입니다.

```wgsl
struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
```
