[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ensureVertexIndexBuiltin

# Function: ensureVertexIndexBuiltin()

> **ensureVertexIndexBuiltin**(`shaderSource`): `string`

Defined in: [src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts:16](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/wgslParser/core/ensureVertexIndexBuiltin.ts#L16)

WGSL 셰이더 코드에 `vertex_index` 빌트인 인자가 포함되어 있는지 확인하고, 없으면 자동으로 주입합니다.


Vertex 셰이더 함수에서 `vertex_index`가 필요한 경우를 대비해 자동으로 인자를 추가해 주는 유틸리티입니다.


## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shaderSource` | `string` | 검사할 WGSL 셰이더 소스 코드

## Returns

`string`

`vertex_index`가 보장된 셰이더 소스 코드

