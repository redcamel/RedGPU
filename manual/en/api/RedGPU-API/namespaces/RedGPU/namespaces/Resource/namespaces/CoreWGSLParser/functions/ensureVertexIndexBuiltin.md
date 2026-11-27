[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ensureVertexIndexBuiltin

# ~~Function: ensureVertexIndexBuiltin()~~

> **ensureVertexIndexBuiltin**(`shaderSource`): `string`

Defined in: [src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts:14](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts#L14)

Checks if the `@builtin(vertex_index)` argument is included in the WGSL shader's vertex entry function, and automatically injects it if missing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shaderSource` | `string` | WGSL shader source code to check |

## Returns

`string`

Shader source code with guaranteed `vertex_index`

## Deprecated
