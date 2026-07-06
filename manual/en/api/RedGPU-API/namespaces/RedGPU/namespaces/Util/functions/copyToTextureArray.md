[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`commandEncoder`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:16](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/utils/texture/copyToTextureArray.ts#L16)

Copies a source texture to a specific slice of a texture array.

* ### Example
```typescript
RedGPU.Util.copyToTextureArray(commandEncoder, sourceTex, targetArrayTex, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | Command Encoder |
| `sourceTexture` | `GPUTexture` | Source texture |
| `targetArrayTexture` | `GPUTexture` | Target texture array |
| `sliceIndex` | `number` | Target slice index |

## Returns

`void`
