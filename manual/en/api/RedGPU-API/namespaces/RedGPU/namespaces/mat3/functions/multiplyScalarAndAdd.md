[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat3](../README.md) / multiplyScalarAndAdd

# Function: multiplyScalarAndAdd()

> **multiplyScalarAndAdd**(`out`, `a`, `b`, `scale`): [`mat3`](../../../type-aliases/mat3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:879

Adds two mat3's after multiplying each element of the second operand by a scalar value.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat3`](../../../type-aliases/mat3.md) | the receiving vector |
| `a` | `ReadonlyMat3` | the first operand |
| `b` | `ReadonlyMat3` | the second operand |
| `scale` | `number` | the amount to scale b's elements by before adding |

## Returns

[`mat3`](../../../type-aliases/mat3.md)

out
