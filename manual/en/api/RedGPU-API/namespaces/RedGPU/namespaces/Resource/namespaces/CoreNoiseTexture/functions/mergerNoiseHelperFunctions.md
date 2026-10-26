[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / mergerNoiseHelperFunctions

# Function: mergerNoiseHelperFunctions()

> **mergerNoiseHelperFunctions**(`baseHelperFunctions`, `addHelperFunctions`): `string`

Defined in: [src/resources/texture/noiseTexture/core/noiseDefineMerges.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/noiseDefineMerges.ts#L60)

Merges the base WGSL helper function code with additional helper function code using line breaks.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseHelperFunctions` | `string` | Base WGSL helper function code |
| `addHelperFunctions` | `string` | Additional WGSL helper function code to append (ignored if empty) |

## Returns

`string`

Merged WGSL helper function code
