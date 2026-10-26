[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FRONT\_FACE

# Variable: GPU\_FRONT\_FACE

> `const` **GPU\_FRONT\_FACE**: `object`

Defined in: [src/gpuConst/GPU\_FRONT\_FACE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L7)

Constants defining which polygon side is considered the front face based on vertex winding order.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-ccw"></a> `CCW` | `"ccw"` | `'ccw'` | Considers polygons with counter-clockwise (`'ccw'`) vertex winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L17) |
| <a id="property-cw"></a> `CW` | `"cw"` | `'cw'` | Considers polygons with clockwise (`'cw'`) vertex winding as the front face. | [src/gpuConst/GPU\_FRONT\_FACE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L12) |
