[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_LOAD\_OP

# Variable: GPU\_LOAD\_OP

> `const` **GPU\_LOAD\_OP**: `object`

Defined in: [src/gpuConst/GPU\_LOAD\_OP.ts:10](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/gpuConst/GPU_LOAD_OP.ts#L10)


Constants defining how to load attachments at the start of a render pass.


Determines how to handle existing data before starting a new rendering task.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clear"></a> `CLEAR` | `"clear"` | `'clear'` | Initializes (clears) the attachment with a specified color or value. | [src/gpuConst/GPU\_LOAD\_OP.ts:20](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/gpuConst/GPU_LOAD_OP.ts#L20) |
| <a id="load"></a> `LOAD` | `"load"` | `'load'` | Loads and maintains the contents of the existing attachment. | [src/gpuConst/GPU\_LOAD\_OP.ts:15](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/gpuConst/GPU_LOAD_OP.ts#L15) |
