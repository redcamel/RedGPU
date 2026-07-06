[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:17](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/utils/texture/calculateTextureByteSize.ts#L17)

Calculates the total byte size of a GPUTexture.

Calculates the actual memory size used by the texture based on its width, height, layers (or depth), and sample count.

* ### Example
```typescript
const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | Target GPUTexture object |

## Returns

`number`

Calculated total byte size
