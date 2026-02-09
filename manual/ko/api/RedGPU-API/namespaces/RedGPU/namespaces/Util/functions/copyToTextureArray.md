[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`gpuDevice`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/utils/texture/copyToTextureArray.ts#L24)

소스 텍스처를 배열 텍스처의 특정 슬라이스에 복사합니다.


* ### Example
```typescript
RedGPU.Util.copyToTextureArray(device, sourceTex, targetArrayTex, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | 복사 작업에 사용할 GPU 디바이스
| `sourceTexture` | `GPUTexture` | 복사할 소스 텍스처
| `targetArrayTexture` | `GPUTexture` | 복사 대상 배열 텍스처
| `sliceIndex` | `number` | 복사할 슬라이스 인덱스

## Returns

`void`
