[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`code`): `PreprocessedWGSLResult`

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:140](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/preprocessWGSL.ts#L140)


Preprocesses WGSL shader code.


This function processes RedGPU-specific macros such as #redgpu_include, REDGPU_DEFINE_*, and #redgpu_if, and extracts information for generating shader variants.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | `string` | WGSL source code to preprocess |

## Returns

`PreprocessedWGSLResult`


Preprocessing result object (including cache key, default source, and variant generator)
