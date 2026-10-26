[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseUniformStruct

# Function: mergerNoiseUniformStruct()

> **mergerNoiseUniformStruct**(`baseStruct`, `addStruct`): `string`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L20)

Merges the base uniform struct definition string with an additional definition string using line breaks.

### Example
```typescript
const struct = RedGPU.Resource.CoreNoiseTexture.mergerNoiseUniformStruct('frequency: f32,', 'seed: f32,');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseStruct` | `string` | Base uniform struct member definitions (WGSL) |
| `addStruct` | `string` | Additional uniform struct member definitions to append (WGSL, ignored if empty) |

## Returns

`string`

Merged uniform struct definition string
