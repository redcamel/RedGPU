[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseHelperFunctions

# Function: mergerNoiseHelperFunctions()

> **mergerNoiseHelperFunctions**(`baseHelperFunctions`, `addHelperFunctions`): `string`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:60](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L60)

기본 WGSL 헬퍼 함수 코드와 추가 헬퍼 함수 코드를 줄바꿈으로 병합합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseHelperFunctions` | `string` | 기본 WGSL 헬퍼 함수 코드 |
| `addHelperFunctions` | `string` | 추가할 WGSL 헬퍼 함수 코드 (비어 있으면 무시) |

## Returns

`string`

병합된 WGSL 헬퍼 함수 코드
