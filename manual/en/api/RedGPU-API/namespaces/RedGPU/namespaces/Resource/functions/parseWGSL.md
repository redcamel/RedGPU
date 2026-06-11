[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / parseWGSL

# Function: parseWGSL()

> **parseWGSL**(`sourceName`, `code`, `injectLibrary?`): `object`

Defined in: [src/resources/wgslParser/parseWGSL.ts:153](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L153)

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
| `computeEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:160](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L160) |
| `conditionalBlocks` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:163](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L163) |
| `defaultSource` | `string` | [src/resources/wgslParser/parseWGSL.ts:161](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L161) |
| `fragmentEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:159](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L159) |
| `samplers` | `any` | [src/resources/wgslParser/parseWGSL.ts:156](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L156) |
| `shaderSourceVariant` | `any` | [src/resources/wgslParser/parseWGSL.ts:162](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L162) |
| `storage` | `any` | [src/resources/wgslParser/parseWGSL.ts:155](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L155) |
| `textures` | `any` | [src/resources/wgslParser/parseWGSL.ts:157](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L157) |
| `uniforms` | `any` | [src/resources/wgslParser/parseWGSL.ts:154](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L154) |
| `vertexEntries` | `string`[] | [src/resources/wgslParser/parseWGSL.ts:158](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/wgslParser/parseWGSL.ts#L158) |
