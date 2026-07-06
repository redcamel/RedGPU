[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`sourceName`, `code`, `injectLibrary?`): [`PreprocessedWGSLResult`](../interfaces/PreprocessedWGSLResult.md)

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:262](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/wgslParser/core/preprocessWGSL.ts#L262)

Preprocesses WGSL shader code.

This function processes RedGPU-specific macros such as #redgpu_include, REDGPU_DEFINE_*, and #redgpu_if, and extracts information for generating shader variants.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceName` | `string` | Shader source identifier name (for warnings) |
| `code` | `string` | WGSL source code to preprocess |
| `injectLibrary?` | `Record`\<`string`, `string`\> | Injected local library object (optional) |

## Returns

[`PreprocessedWGSLResult`](../interfaces/PreprocessedWGSLResult.md)

Preprocessing result object (including cache key, default source, and variant generator)
