[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_MIPMAP\_FILTER\_MODE

# Variable: GPU\_MIPMAP\_FILTER\_MODE

> `const` **GPU\_MIPMAP\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L10)


Constants defining filtering mode options for sampling between mipmap levels.


Determines how to interpolate between mipmap levels of a texture.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="linear"></a> `LINEAR` | `"linear"` | `'linear'` | Linearly interpolates between two adjacent mipmap levels. | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L20) |
| <a id="nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | Samples from the nearest mipmap level. | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L15) |
