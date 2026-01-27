[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / fromRotation

# Function: fromRotation()

> **fromRotation**(`out`, `rad`, `axis`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1124

Creates a matrix from a given angle around a given axis
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.rotate(dest, dest, rad, axis);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `rad` | `number` | the angle to rotate the matrix by |
| `axis` | `ReadonlyVec3` | the axis to rotate around |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
