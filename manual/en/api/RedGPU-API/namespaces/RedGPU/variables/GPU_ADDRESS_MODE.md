[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_ADDRESS\_MODE

# Variable: GPU\_ADDRESS\_MODE

> `const` **GPU\_ADDRESS\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_ADDRESS\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_ADDRESS_MODE.ts#L10)


Constants defining address mode options for texture sampling and wrapping.


Determines how textures are sampled when coordinates are outside the [0, 1] range.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clamp_to_edge"></a> `CLAMP_TO_EDGE` | `"clamp-to-edge"` | `'clamp-to-edge'` | Clamps texture coordinates to the [0, 1] range. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_ADDRESS_MODE.ts#L15) |
| <a id="mirrored_repeat"></a> `MIRRORED_REPEAT` | `"mirror-repeat"` | `'mirror-repeat'` | Repeats the texture in a tiled fashion, mirroring each alternate tile. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:25](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_ADDRESS_MODE.ts#L25) |
| <a id="repeat"></a> `REPEAT` | `"repeat"` | `'repeat'` | Repeats the texture in a tiled fashion. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_ADDRESS_MODE.ts#L20) |
