[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:16](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/texture/calculateTextureByteSize.ts#L16)

Calculates the total byte size of a `GPUTexture` based on its format, resolution, layer count, and sample count.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | Target `GPUTexture` object to calculate byte size |

## Returns

`number`

Calculated total byte size of the texture

## Throws

Throws `Error` if the texture format is unsupported or unrecognized.
