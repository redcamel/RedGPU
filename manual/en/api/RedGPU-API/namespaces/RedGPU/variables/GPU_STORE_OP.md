[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_STORE\_OP

# Variable: GPU\_STORE\_OP

> `const` **GPU\_STORE\_OP**: `object`

Defined in: [src/gpuConst/GPU\_STORE\_OP.ts:10](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_STORE_OP.ts#L10)


Constants defining how to store attachment contents at the end of a render pass.


Determines whether to store the rendering results in memory or discard them.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="discard"></a> `DISCARD` | `"discard"` | `'discard'` | Discards the rendered results without storing them. | [src/gpuConst/GPU\_STORE\_OP.ts:20](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_STORE_OP.ts#L20) |
| <a id="store"></a> `STORE` | `"store"` | `'store'` | Stores the rendered results in the attachment. | [src/gpuConst/GPU\_STORE\_OP.ts:15](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/gpuConst/GPU_STORE_OP.ts#L15) |
