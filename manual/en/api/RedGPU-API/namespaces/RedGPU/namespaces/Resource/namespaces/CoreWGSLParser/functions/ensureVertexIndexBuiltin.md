[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ensureVertexIndexBuiltin

# Function: ensureVertexIndexBuiltin()

> **ensureVertexIndexBuiltin**(`shaderSource`): `string`

Defined in: [src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts:16](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts#L16)

Checks if the `vertex_index` builtin argument is included in the WGSL shader code, and automatically injects it if not.

This utility automatically adds the argument in case `vertex_index` is needed in the vertex shader function.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shaderSource` | `string` | WGSL shader source code to check |

## Returns

`string`

Shader source code with guaranteed `vertex_index`
