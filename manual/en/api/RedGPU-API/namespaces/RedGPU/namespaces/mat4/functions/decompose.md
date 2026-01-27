[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / decompose

# Function: decompose()

> **decompose**(`out_r`, `out_t`, `out_s`, `mat`): `quat`

Defined in: node\_modules/gl-matrix/index.d.ts:1225

Decomposes a transformation matrix into its rotation, translation
and scale components. Returns only the rotation component

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out_r` | `quat` | Quaternion to receive the rotation component |
| `out_t` | `vec3` | Vector to receive the translation vector |
| `out_s` | `vec3` | Vector to receive the scaling factor |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

`quat`

out_r
