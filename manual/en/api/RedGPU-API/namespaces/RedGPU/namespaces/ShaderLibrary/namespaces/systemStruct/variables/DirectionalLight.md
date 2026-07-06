[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / DirectionalLight

# Variable: DirectionalLight

> `const` **DirectionalLight**: `string` = `DirectionalLight_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2378](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L2378)

Definition of the DirectionalLight structure.

```wgsl
struct DirectionalLight {
	  direction:vec3<f32>,
	  color:vec3<f32>,
	  intensity:f32,
};
```
