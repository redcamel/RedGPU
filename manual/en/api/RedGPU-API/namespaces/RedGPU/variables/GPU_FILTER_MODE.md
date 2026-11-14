[**RedGPU API v4.5.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FILTER\_MODE

# Variable: GPU\_FILTER\_MODE

> `const` **GPU\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_FILTER\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_FILTER_MODE.ts#L7)

Filter mode constants defining the pixel interpolation method during texture magnification and minification sampling.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | Linearly interpolates the values of adjacent texels surrounding the sampling coordinates. | [src/gpuConst/GPU\_FILTER\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_FILTER_MODE.ts#L17) |
| <a id="property-nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | Returns the value of the single texel nearest to the sampling coordinates. | [src/gpuConst/GPU\_FILTER\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/gpuConst/GPU_FILTER_MODE.ts#L12) |
