[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / getScaling

# Function: getScaling()

> **getScaling**(`out`, `mat`): [`vec3`](../../../type-aliases/vec3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1205

Returns the scaling factor component of a transformation
 matrix. If a matrix is built with fromRotationTranslationScale
 with a normalized Quaternion parameter, the returned vector will be
 the same as the scaling vector
 originally supplied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec3`](../../../type-aliases/vec3.md) | Vector to receive scaling factor component |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

[`vec3`](../../../type-aliases/vec3.md)

out
