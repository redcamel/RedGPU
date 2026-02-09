[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / rotate

# Function: rotate()

> **rotate**(`out`, `a`, `rad`, `axis`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1060

Rotates a mat4 by the given angle around the given axis

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | the receiving matrix |
| `a` | `ReadonlyMat4` | the matrix to rotate |
| `rad` | `number` | the angle to rotate the matrix by |
| `axis` | `ReadonlyVec3` | the axis to rotate around |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
