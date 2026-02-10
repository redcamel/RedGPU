[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_OPERATION

# Variable: GPU\_BLEND\_OPERATION

> `const` **GPU\_BLEND\_OPERATION**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_OPERATION.ts:10](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L10)


Constants defining mathematical operation options used in blending.


Determines how to combine the source and destination color results.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-add"></a> `ADD` | `"add"` | `"add"` | Adds the source and destination results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:15](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L15) |
| <a id="property-max"></a> `MAX` | `"max"` | `"max"` | Selects the maximum of the two results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:35](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L35) |
| <a id="property-min"></a> `MIN` | `"min"` | `"min"` | Selects the minimum of the two results. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:30](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L30) |
| <a id="property-reverse_subtract"></a> `REVERSE_SUBTRACT` | `"reverse-subtract"` | `"reverse-subtract"` | Subtracts the destination result from the source result. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:25](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L25) |
| <a id="property-subtract"></a> `SUBTRACT` | `"subtract"` | `"subtract"` | Subtracts the source result from the destination result. | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:20](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/gpuConst/GPU_BLEND_OPERATION.ts#L20) |
