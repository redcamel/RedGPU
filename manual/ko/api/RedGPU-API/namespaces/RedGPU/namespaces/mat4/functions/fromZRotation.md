[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / fromZRotation

# Function: fromZRotation()

> **fromZRotation**(`out`, `rad`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1140

Creates a matrix from the given angle around the Z axis
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.rotateZ(dest, dest, rad);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `rad` | `number` | the angle to rotate the matrix by |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
