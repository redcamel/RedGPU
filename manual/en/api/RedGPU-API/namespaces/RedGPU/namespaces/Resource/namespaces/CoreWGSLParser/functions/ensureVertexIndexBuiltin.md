[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ensureVertexIndexBuiltin

# ~~Function: ensureVertexIndexBuiltin()~~

> **ensureVertexIndexBuiltin**(`shaderSource`): `string`

Defined in: [src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts#L14)

Checks if the `@builtin(vertex_index)` argument is included in the WGSL shader's vertex entry function, and automatically injects it if missing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shaderSource` | `string` | WGSL shader source code to check |

## Returns

`string`

Shader source code with guaranteed `vertex_index`

## Deprecated
