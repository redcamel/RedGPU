[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [vec3](../README.md) / slerp

# Function: slerp()

> **slerp**(`out`, `a`, `b`, `t`): [`vec3`](../../../type-aliases/vec3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1725

Performs a spherical linear interpolation between two vec3's

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec3`](../../../type-aliases/vec3.md) | the receiving vector |
| `a` | `ReadonlyVec3` | the first operand |
| `b` | `ReadonlyVec3` | the second operand |
| `t` | `number` | interpolation amount, in the range [0-1], between the two inputs |

## Returns

[`vec3`](../../../type-aliases/vec3.md)

out
