[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_OPERATION

# Variable: GPU\_BLEND\_OPERATION

> `const` **GPU\_BLEND\_OPERATION**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_OPERATION.ts:10](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L10)


Constants defining mathematical operation options used in blending.


Determines how to combine the source and destination color results.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="add"></a> `ADD` | `"add"` | `"add"` | Adds the source and destination results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:15](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L15) |
| <a id="max"></a> `MAX` | `"max"` | `"max"` | Selects the maximum of the two results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:35](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L35) |
| <a id="min"></a> `MIN` | `"min"` | `"min"` | Selects the minimum of the two results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:30](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L30) |
| <a id="reverse_subtract"></a> `REVERSE_SUBTRACT` | `"reverse-subtract"` | `"reverse-subtract"` | Subtracts the destination result from the source result. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L25) |
| <a id="subtract"></a> `SUBTRACT` | `"subtract"` | `"subtract"` | Subtracts the source result from the destination result. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_BLEND_OPERATION.ts#L20) |
