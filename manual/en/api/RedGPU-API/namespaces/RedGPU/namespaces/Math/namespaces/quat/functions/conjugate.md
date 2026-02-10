[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / conjugate

# Function: conjugate()

> **conjugate**(`out`, `a`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2405

Calculates the conjugate of a quat
If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `a` | `ReadonlyQuat` | quat to calculate conjugate of |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
