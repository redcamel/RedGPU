[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:16](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/utils/texture/calculateTextureByteSize.ts#L16)

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
