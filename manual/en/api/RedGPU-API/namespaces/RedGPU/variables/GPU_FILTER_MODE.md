[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FILTER\_MODE

# Variable: GPU\_FILTER\_MODE

> `const` **GPU\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_FILTER\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FILTER_MODE.ts#L10)


Constants defining filtering mode options for texture sampling.


Determines the interpolation method between pixels during texture magnification and minification.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | Uses linear interpolation of surrounding texel values. | [src/gpuConst/GPU\_FILTER\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FILTER_MODE.ts#L20) |
| <a id="property-nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | Uses the value of the nearest texel. | [src/gpuConst/GPU\_FILTER\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_FILTER_MODE.ts#L15) |
