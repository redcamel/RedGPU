[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FRONT\_FACE

# Variable: GPU\_FRONT\_FACE

> `const` **GPU\_FRONT\_FACE**: `object`

Defined in: [src/gpuConst/GPU\_FRONT\_FACE.ts:10](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/gpuConst/GPU_FRONT_FACE.ts#L10)


Constants defining the vertex winding order used to determine the front face.


Determines which side is the front face based on the order in which vertices are arranged.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="ccw"></a> `CCW` | `"ccw"` | `'ccw'` | Considers faces with counter-clockwise winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:20](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/gpuConst/GPU_FRONT_FACE.ts#L20) |
| <a id="cw"></a> `CW` | `"cw"` | `'cw'` | Considers faces with clockwise winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:15](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/gpuConst/GPU_FRONT_FACE.ts#L15) |
