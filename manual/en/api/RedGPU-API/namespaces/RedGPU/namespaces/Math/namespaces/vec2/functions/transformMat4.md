[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [vec2](../README.md) / transformMat4

# Function: transformMat4()

> **transformMat4**(`out`, `a`, `m`): [`vec2`](../../../type-aliases/vec2.md)

Defined in: node\_modules/gl-matrix/index.d.ts:3208

Transforms the vec2 with a mat4
3rd vector component is implicitly '0'
4th vector component is implicitly '1'

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec2`](../../../type-aliases/vec2.md) | the receiving vector |
| `a` | `ReadonlyVec2` | the vector to transform |
| `m` | `ReadonlyMat4` | matrix to transform with |

## Returns

[`vec2`](../../../type-aliases/vec2.md)

out
