[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:17](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/utils/texture/calculateTextureByteSize.ts#L17)

GPUTexture의 전체 바이트 크기를 계산합니다.

가로, 세로, 레이어(또는 깊이) 수와 샘플 수를 기반으로 텍스처가 사용하는 실제 메모리 크기를 계산합니다.

* ### Example
```typescript
const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | 대상 GPUTexture 객체

## Returns

`number`

계산된 전체 바이트 크기
