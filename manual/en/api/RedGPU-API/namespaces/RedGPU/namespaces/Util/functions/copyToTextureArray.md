[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`gpuDevice`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/utils/texture/copyToTextureArray.ts#L24)


Copies a source texture to a specific slice of a texture array.

* ### Example
```typescript
RedGPU.Util.copyToTextureArray(device, sourceTex, targetArrayTex, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | GPU device to use for the copy operation |
| `sourceTexture` | `GPUTexture` | Source texture to copy from |
| `targetArrayTexture` | `GPUTexture` | Target texture array to copy to |
| `sliceIndex` | `number` | Slice index to copy into |

## Returns

`void`
