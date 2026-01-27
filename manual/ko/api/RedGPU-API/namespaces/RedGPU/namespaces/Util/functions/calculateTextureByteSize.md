[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:18](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/utils/texture/calculateTextureByteSize.ts#L18)

GPUTexture의 바이트 크기를 계산합니다.


* ### Example
```typescript
const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | 바이트 크기를 계산할 GPUTexture 객체

## Returns

`number`

계산된 전체 바이트 크기

