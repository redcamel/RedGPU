[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / DirectionalLight

# Variable: DirectionalLight

> `const` **DirectionalLight**: `string` = `DirectionalLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2346](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L2346)

직사광(DirectionalLight) 구조체 정의입니다.

```wgsl
struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
```
