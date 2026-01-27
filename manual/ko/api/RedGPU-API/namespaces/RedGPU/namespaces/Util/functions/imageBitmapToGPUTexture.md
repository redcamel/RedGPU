[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / imageBitmapToGPUTexture

# Function: imageBitmapToGPUTexture()

> **imageBitmapToGPUTexture**(`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha`): `GPUTexture`

Defined in: [src/utils/texture/imageBitmapToGPUTexture.ts:27](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/texture/imageBitmapToGPUTexture.ts#L27)

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

