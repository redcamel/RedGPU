[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseUniformStruct

# Function: mergerNoiseUniformStruct()

> **mergerNoiseUniformStruct**(`baseStruct`, `addStruct`): `string`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L20)

기본 유니폼 구조체 정의 문자열과 추가 정의 문자열을 줄바꿈으로 병합합니다.

### Example
```typescript
const struct = RedGPU.Resource.CoreNoiseTexture.mergerNoiseUniformStruct('frequency: f32,', 'seed: f32,');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseStruct` | `string` | 기본 유니폼 구조체 멤버 정의 (WGSL) |
| `addStruct` | `string` | 추가할 유니폼 구조체 멤버 정의 (WGSL, 비어 있으면 무시) |

## Returns

`string`

병합된 유니폼 구조체 정의 문자열
