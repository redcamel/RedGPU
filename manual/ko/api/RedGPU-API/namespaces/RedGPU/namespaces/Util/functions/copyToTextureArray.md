[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`commandEncoder`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:16](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/utils/texture/copyToTextureArray.ts#L16)

소스 텍스처를 배열 텍스처의 특정 슬라이스(Slice)로 복사합니다.

* ### Example
```typescript
RedGPU.Util.copyToTextureArray(commandEncoder, sourceTex, targetArrayTex, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 커맨드 인코더
| `sourceTexture` | `GPUTexture` | 복사할 소스 텍스처
| `targetArrayTexture` | `GPUTexture` | 대상 배열 텍스처
| `sliceIndex` | `number` | 대상 슬라이스 인덱스

## Returns

`void`
