[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / decompose

# Function: decompose()

> **decompose**(`out_r`, `out_t`, `out_s`, `mat`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1225

Decomposes a transformation matrix into its rotation, translation
and scale components. Returns only the rotation component

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out_r` | [`quat`](../../../type-aliases/quat.md) | Quaternion to receive the rotation component |
| `out_t` | [`vec3`](../../../type-aliases/vec3.md) | Vector to receive the translation vector |
| `out_s` | [`vec3`](../../../type-aliases/vec3.md) | Vector to receive the scaling factor |
| `mat` | `ReadonlyMat4` | Matrix to be decomposed (input) |

## Returns

[`quat`](../../../type-aliases/quat.md)

out_r
