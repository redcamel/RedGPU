[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`sourceName`, `code`, `injectLibrary?`): `object`

Defined in: [src/resources/wgslParser/parseWGSL.ts:191](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L191)

Parses WGSL code and returns reflection information.

This function analyzes WGSL source code to extract information about uniforms, storage, samplers, and textures, and supports conditional compilation (variant) processing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceName` | `string` | Shader source identifier name (for warnings) |
| `code` | `string` | WGSL shader code string to parse |
| `injectLibrary?` | `Record`\<`string`, `string`\> | Injected local library object (optional) |

## Returns

`object`

An object containing reflection information and preprocessed source code

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `computeEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:199](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L199) |
| `conditionalBlocks` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:202](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L202) |
| `defaultSource` | `string` | [src/resources/wgslParser/parseWGSL.ts:200](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L200) |
| `fragmentEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:198](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L198) |
| `samplers` | `any` | [src/resources/wgslParser/parseWGSL.ts:195](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L195) |
| `shaderSourceVariant` | `any` | [src/resources/wgslParser/parseWGSL.ts:201](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L201) |
| `storage` | `any` | [src/resources/wgslParser/parseWGSL.ts:193](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L193) |
| `structs` | `any` | [src/resources/wgslParser/parseWGSL.ts:194](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L194) |
| `textures` | `any` | [src/resources/wgslParser/parseWGSL.ts:196](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L196) |
| `uniforms` | `any` | [src/resources/wgslParser/parseWGSL.ts:192](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L192) |
| `vertexEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:197](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/parseWGSL.ts#L197) |
