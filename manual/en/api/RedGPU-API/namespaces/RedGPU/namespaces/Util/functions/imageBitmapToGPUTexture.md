[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:27](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/utils/texture/imageBitmapToGPUTexture.ts#L27)


Creates a GPUTexture from an array of ImageBitmaps.

* ### Example
```typescript
const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | `undefined` | GPUDevice instance |
| `imageBitmaps` | `ImageBitmap`[] | `undefined` | Array of ImageBitmaps to copy |
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | GPUTexture descriptor |
| `usePremultiplyAlpha` | `boolean` | `true` | Whether to use premultiplied alpha (Default: true) |

## Returns

`GPUTexture`


Created GPUTexture object
