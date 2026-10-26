[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseUniformDefault

# Function: mergerNoiseUniformDefault()

> **mergerNoiseUniformDefault**(`basicOption`, `addOption`): `any`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L40)

Shallow-merges the base uniform default object with an additional default object and returns a new object.

If the same key exists, the value from `addOption` takes precedence.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `basicOption` | `any` | Base uniform default object |
| `addOption` | `any` | Additional uniform default object (optional) |

## Returns

`any`

Merged uniform default object
