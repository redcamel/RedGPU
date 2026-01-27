[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / getScaling

# Function: getScaling()

> **getScaling**(`out`, `mat`): `vec3`

Defined in: node\_modules/gl-matrix/index.d.ts:1185

Returns the scaling factor component of a transformation
 matrix. If a matrix is built with fromRotationTranslationScale
 with a normalized Quaternion paramter, the returned vector will be
 the same as the scaling vector
 originally supplied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | `vec3` | Vector to receive scaling factor component |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

`vec3`

out
