[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`code`): `any`

Defined in: [src/resources/wgslParser/parseWGSL.ts:147](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/wgslParser/parseWGSL.ts#L147)


Parses WGSL code and returns reflection information.


This function analyzes WGSL source code to extract information about uniforms, storage, samplers, and textures, and supports conditional compilation (variant) processing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | WGSL shader code string to parse |

## Returns

`any`


An object containing reflection information and preprocessed source code
