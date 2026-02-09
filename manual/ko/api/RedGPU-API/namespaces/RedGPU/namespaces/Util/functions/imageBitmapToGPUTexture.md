[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:27](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/utils/texture/imageBitmapToGPUTexture.ts#L27)

ImageBitmap 배열을 GPUTexture로 생성합니다.


* ### Example
```typescript
const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | `undefined` | GPUDevice 인스턴스
| `imageBitmaps` | `ImageBitmap`[] | `undefined` | 복사할 ImageBitmap 배열
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | GPUTexture 디스크립터
| `usePremultiplyAlpha` | `boolean` | `true` | 프리멀티플 알파 사용 여부 (기본값: true)

## Returns

`GPUTexture`

생성된 GPUTexture 객체

