[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / DirectionalLight

# Variable: DirectionalLight

> `const` **DirectionalLight**: `string` = `DirectionalLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2378](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L2378)

Definition of the DirectionalLight structure.

```wgsl
struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
```
