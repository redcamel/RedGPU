[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`commandEncoder`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/copyToTextureArray.ts#L26)

Copies a source texture to a specific slice of a texture array.

### Example
```typescript
// Copy source texture to slice 0 of the texture array
RedGPU.Util.copyToTextureArray(commandEncoder, sourceTexture, targetArrayTexture, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | Command encoder |
| `sourceTexture` | `GPUTexture` | Source texture to copy |
| `targetArrayTexture` | `GPUTexture` | Target texture array |
| `sliceIndex` | `number` | Target slice index |

## Returns

`void`
