[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`code`): `PreprocessedWGSLResult`

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:209](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/wgslParser/core/preprocessWGSL.ts#L209)


Preprocesses WGSL shader code.


This function processes RedGPU-specific macros such as #redgpu_include, REDGPU_DEFINE_*, and #redgpu_if, and extracts information for generating shader variants.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | WGSL source code to preprocess |

## Returns

`PreprocessedWGSLResult`


Preprocessing result object (including cache key, default source, and variant generator)
