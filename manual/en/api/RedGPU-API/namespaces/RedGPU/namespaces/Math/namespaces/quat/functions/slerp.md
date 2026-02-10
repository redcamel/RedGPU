[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / slerp

# Function: slerp()

> **slerp**(`out`, `a`, `b`, `t`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2381

Performs a spherical linear interpolation between two quat

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `a` | `ReadonlyQuat` | the first operand |
| `b` | `ReadonlyQuat` | the second operand |
| `t` | `number` | interpolation amount, in the range [0-1], between the two inputs |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
