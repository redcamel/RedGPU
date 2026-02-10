[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / calculateW

# Function: calculateW()

> **calculateW**(`out`, `a`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2346

Calculates the W component of a quat from the X, Y, and Z components.
Assumes that quaternion is 1 unit in length.
Any existing W component will be ignored.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `a` | `ReadonlyQuat` | quat to calculate W component of |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
