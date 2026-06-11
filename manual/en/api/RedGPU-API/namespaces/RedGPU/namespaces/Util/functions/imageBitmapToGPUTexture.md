[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha?`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:20](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/utils/texture/imageBitmapToGPUTexture.ts#L20)

Creates a GPUTexture using an array of ImageBitmaps.

Internally uses copyExternalImageToTexture and automatically adds necessary Usage flags.

* ### Example
```typescript
const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | `undefined` | GPUDevice instance |
| `imageBitmaps` | `ImageBitmap`[] | `undefined` | Array of source ImageBitmaps |
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | Texture descriptor to create |
| `usePremultiplyAlpha` | `boolean` | `true` | Whether to use premultiplied alpha (Default: true) |

## Returns

`GPUTexture`

Created GPUTexture
