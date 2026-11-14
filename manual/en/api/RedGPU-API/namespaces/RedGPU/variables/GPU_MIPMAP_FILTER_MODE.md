[**RedGPU API v4.5.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_MIPMAP\_FILTER\_MODE

# Variable: GPU\_MIPMAP\_FILTER\_MODE

> `const` **GPU\_MIPMAP\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L7)

Filter mode constants defining the interpolation method between different mipmap levels during texture sampling.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | Samples from the two adjacent mipmap levels and linearly interpolates between them (Trilinear Filtering). | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L17) |
| <a id="property-nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | Selects and samples from the single mipmap level nearest to the computed Level of Detail (LOD). | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L12) |
