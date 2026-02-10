[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / fromScaling

# Function: fromScaling()

> **fromScaling**(`out`, `v`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1111

Creates a matrix from a vector scaling
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.scale(dest, dest, vec);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `v` | `ReadonlyVec3` | Scaling vector |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
