[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / fromMat3

# Function: fromMat3()

> **fromMat3**(`out`, `m`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2417

**`Function`**

Creates a quaternion from the given 3x3 rotation matrix.

NOTE: The resultant quaternion is not normalized, so you should be sure
to renormalize the quaternion yourself where necessary.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `m` | `ReadonlyMat3` | rotation matrix |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
