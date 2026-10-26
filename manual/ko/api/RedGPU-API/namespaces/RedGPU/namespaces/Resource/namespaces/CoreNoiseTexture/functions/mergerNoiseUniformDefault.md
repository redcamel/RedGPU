[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseUniformDefault

# Function: mergerNoiseUniformDefault()

> **mergerNoiseUniformDefault**(`basicOption`, `addOption`): `any`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L40)

기본 유니폼 기본값 객체와 추가 기본값 객체를 얕은 병합하여 새 객체를 반환합니다.

동일한 키가 존재하면 `addOption`의 값이 우선합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `basicOption` | `any` | 기본 유니폼 기본값 객체 |
| `addOption` | `any` | 추가 유니폼 기본값 객체 (선택) |

## Returns

`any`

병합된 유니폼 기본값 객체
