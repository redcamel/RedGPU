[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / getRotation

# Function: getRotation()

> **getRotation**(`out`, `mat`): `quat`

Defined in: node\_modules/gl-matrix/index.d.ts:1215

Returns a quaternion representing the rotational component
 of a transformation matrix. If a matrix is built with
 fromRotationTranslation, the returned quaternion will be the
 same as the quaternion originally supplied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | `quat` | Quaternion to receive the rotation component |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

`quat`

out
