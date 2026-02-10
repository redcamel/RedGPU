[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha?`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:27](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/utils/texture/imageBitmapToGPUTexture.ts#L27)


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
