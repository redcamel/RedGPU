[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FILTER\_MODE

# Variable: GPU\_FILTER\_MODE

> `const` **GPU\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_FILTER\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/gpuConst/GPU_FILTER_MODE.ts#L10)


Constants defining filtering mode options for texture sampling.


Determines the interpolation method between pixels during texture magnification and minification.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="linear"></a> `LINEAR` | `"linear"` | `'linear'` | Uses linear interpolation of surrounding texel values. | [src/gpuConst/GPU\_FILTER\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/gpuConst/GPU_FILTER_MODE.ts#L20) |
| <a id="nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | Uses the value of the nearest texel. | [src/gpuConst/GPU\_FILTER\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/gpuConst/GPU_FILTER_MODE.ts#L15) |
