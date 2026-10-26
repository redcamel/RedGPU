[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ensureVertexIndexBuiltin

# ~~Function: ensureVertexIndexBuiltin()~~

> **ensureVertexIndexBuiltin**(`shaderSource`): `string`

Defined in: [src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts#L14)

WGSL 셰이더 코드의 버텍스 진입점 함수에 `@builtin(vertex_index)` 인자가 포함되어 있는지 검사하고, 누락된 경우 자동으로 주입합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shaderSource` | `string` | 검사할 WGSL 셰이더 소스 코드 |

## Returns

`string`

`vertex_index`가 보장된 셰이더 소스 코드

## Deprecated
