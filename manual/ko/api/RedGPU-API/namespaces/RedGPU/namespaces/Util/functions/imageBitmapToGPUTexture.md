[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha?`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:20](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/utils/texture/imageBitmapToGPUTexture.ts#L20)

ImageBitmap 배열을 사용하여 GPUTexture를 생성합니다.

내부적으로 copyExternalImageToTexture를 사용하며, 필요한 Usage 플래그를 자동으로 추가합니다.

* ### Example
```typescript
const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | `undefined` | GPUDevice 인스턴스
| `imageBitmaps` | `ImageBitmap`[] | `undefined` | 소스 ImageBitmap 배열
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | 생성할 텍스처 디스크립터
| `usePremultiplyAlpha` | `boolean` | `true` | 프리멀티플 알파 사용 여부 (기본값: true)

## Returns

`GPUTexture`

생성된 GPUTexture
