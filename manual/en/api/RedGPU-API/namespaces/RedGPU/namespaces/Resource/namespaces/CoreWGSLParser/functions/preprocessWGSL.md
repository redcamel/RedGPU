[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / preprocessWGSL

# Function: preprocessWGSL()

> **preprocessWGSL**(`sourceName`, `code`, `injectLibrary?`): [`PreprocessedWGSLResult`](../interfaces/PreprocessedWGSLResult.md)

Defined in: [src/resources/wgslParser/core/preprocessWGSL.ts:262](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/resources/wgslParser/core/preprocessWGSL.ts#L262)

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
