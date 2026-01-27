[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:18](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/utils/texture/calculateTextureByteSize.ts#L18)

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

