[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/calculateTextureByteSize.ts#L16)

`GPUTexture`의 포맷, 해상도, 레이어 수, 샘플 수를 기반으로 총 바이트 크기를 계산합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | 바이트 크기를 계산할 대상 `GPUTexture` 객체 |

## Returns

`number`

계산된 텍스처의 총 바이트 크기

## Throws

지원하지 않거나 인식할 수 없는 텍스처 포맷인 경우 `Error`가 발생합니다.
