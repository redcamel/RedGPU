[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / getAxisAngle

# Function: getAxisAngle()

> **getAxisAngle**(`out_axis`, `q`): `number`

Defined in: node\_modules/gl-matrix/index.d.ts:2292

Gets the rotation axis and angle for a given
 quaternion. If a quaternion is created with
 setAxisAngle, this method will return the same
 values as providied in the original parameter list
 OR functionally equivalent values.
Example: The quaternion formed by axis [0, 0, 1] and
 angle -90 is the same as the quaternion formed by
 [0, 0, 1] and 270. This method favors the latter.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out_axis` | [`vec3`](../../../type-aliases/vec3.md) | Vector receiving the axis of rotation |
| `q` | `ReadonlyQuat` | Quaternion to be decomposed |

## Returns

`number`

Angle, in radians, of the rotation
