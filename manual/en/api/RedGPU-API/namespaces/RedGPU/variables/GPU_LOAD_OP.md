[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_LOAD\_OP

# Variable: GPU\_LOAD\_OP

> `const` **GPU\_LOAD\_OP**: `object`

Defined in: [src/gpuConst/GPU\_LOAD\_OP.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_LOAD_OP.ts#L7)

Load operation constants determining how initial data in color or depth/stencil attachments is handled at the start of a render pass.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-clear"></a> `CLEAR` | `"clear"` | `'clear'` | Clears the attachment to the specified clear value (`clearValue` or `depthClearValue`) at the start of the render pass. | [src/gpuConst/GPU\_LOAD\_OP.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_LOAD_OP.ts#L17) |
| <a id="property-load"></a> `LOAD` | `"load"` | `'load'` | Preserves and loads the existing contents of the attachment from the previous frame or pass. | [src/gpuConst/GPU\_LOAD\_OP.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_LOAD_OP.ts#L12) |
