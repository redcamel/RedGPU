[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / setAxisAngle

# Function: setAxisAngle()

> **setAxisAngle**(`out`, `axis`, `rad`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2278

Sets a quat from the given angle and rotation axis,
then returns it.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `axis` | `ReadonlyVec3` | the axis around which to rotate |
| `rad` | `number` | the angle in radians |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
