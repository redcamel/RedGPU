[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / getTranslation

# Function: getTranslation()

> **getTranslation**(`out`, `mat`): `vec3`

Defined in: node\_modules/gl-matrix/index.d.ts:1194

Returns the translation vector component of a transformation
 matrix. If a matrix is built with fromRotationTranslation,
 the returned vector will be the same as the translation vector
 originally supplied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | `vec3` | Vector to receive translation component |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

`vec3`

out
