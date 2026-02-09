[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [vec3](../README.md) / transformMat4

# Function: transformMat4()

> **transformMat4**(`out`, `a`, `m`): [`vec3`](../../../type-aliases/vec3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1767

Transforms the vec3 with a mat4.
4th vector component is implicitly '1'

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec3`](../../../type-aliases/vec3.md) | the receiving vector |
| `a` | `ReadonlyVec3` | the vector to transform |
| `m` | `ReadonlyMat4` | matrix to transform with |

## Returns

[`vec3`](../../../type-aliases/vec3.md)

out
