[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:17](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/utils/texture/calculateTextureByteSize.ts#L17)

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
