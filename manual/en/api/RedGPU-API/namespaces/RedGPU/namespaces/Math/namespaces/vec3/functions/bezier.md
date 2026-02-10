[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [vec3](../README.md) / bezier

# Function: bezier()

> **bezier**(`out`, `a`, `b`, `c`, `d`, `t`): [`vec3`](../../../type-aliases/vec3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1749

Performs a bezier interpolation with two control points

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec3`](../../../type-aliases/vec3.md) | the receiving vector |
| `a` | `ReadonlyVec3` | the first operand |
| `b` | `ReadonlyVec3` | the second operand |
| `c` | `ReadonlyVec3` | the third operand |
| `d` | `ReadonlyVec3` | the fourth operand |
| `t` | `number` | interpolation amount, in the range [0-1], between the two inputs |

## Returns

[`vec3`](../../../type-aliases/vec3.md)

out
