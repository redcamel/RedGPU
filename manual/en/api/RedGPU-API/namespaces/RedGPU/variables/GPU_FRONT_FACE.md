[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FRONT\_FACE

# Variable: GPU\_FRONT\_FACE

> `const` **GPU\_FRONT\_FACE**: `object`

Defined in: [src/gpuConst/GPU\_FRONT\_FACE.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FRONT_FACE.ts#L10)


Constants defining the vertex winding order used to determine the front face.


Determines which side is the front face based on the order in which vertices are arranged.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-ccw"></a> `CCW` | `"ccw"` | `'ccw'` | Considers faces with counter-clockwise winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:20](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FRONT_FACE.ts#L20) |
| <a id="property-cw"></a> `CW` | `"cw"` | `'cw'` | Considers faces with clockwise winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:15](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FRONT_FACE.ts#L15) |
