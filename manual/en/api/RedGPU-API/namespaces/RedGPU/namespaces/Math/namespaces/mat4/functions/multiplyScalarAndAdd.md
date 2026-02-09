[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / multiplyScalarAndAdd

# Function: multiplyScalarAndAdd()

> **multiplyScalarAndAdd**(`out`, `a`, `b`, `scale`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1428

Adds two mat4's after multiplying each element of the second operand by a scalar value.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | the receiving vector |
| `a` | `ReadonlyMat4` | the first operand |
| `b` | `ReadonlyMat4` | the second operand |
| `scale` | `number` | the amount to scale b's elements by before adding |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
