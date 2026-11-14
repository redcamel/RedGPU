[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseUniformDefault

# Function: mergerNoiseUniformDefault()

> **mergerNoiseUniformDefault**(`basicOption`, `addOption`): `any`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:40](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L40)

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
