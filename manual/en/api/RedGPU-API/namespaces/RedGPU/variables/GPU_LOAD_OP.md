[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_LOAD\_OP

# Variable: GPU\_LOAD\_OP

> `const` **GPU\_LOAD\_OP**: `object`

Defined in: [src/gpuConst/GPU\_LOAD\_OP.ts:10](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/gpuConst/GPU_LOAD_OP.ts#L10)


Constants defining how to load attachments at the start of a render pass.


Determines how to handle existing data before starting a new rendering task.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clear"></a> `CLEAR` | `"clear"` | `'clear'` | Initializes (clears) the attachment with a specified color or value. | [src/gpuConst/GPU\_LOAD\_OP.ts:20](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/gpuConst/GPU_LOAD_OP.ts#L20) |
| <a id="load"></a> `LOAD` | `"load"` | `'load'` | Loads and maintains the contents of the existing attachment. | [src/gpuConst/GPU\_LOAD\_OP.ts:15](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/gpuConst/GPU_LOAD_OP.ts#L15) |
