[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat3](../README.md) / fromRotation

# Function: fromRotation()

> **fromRotation**(`out`, `rad`): [`mat3`](../../../type-aliases/mat3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:781

Creates a matrix from a given angle
This is equivalent to (but much faster than):

    mat3.identity(dest);
    mat3.rotate(dest, dest, rad);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat3`](../../../type-aliases/mat3.md) | mat3 receiving operation result |
| `rad` | `number` | the angle to rotate the matrix by |

## Returns

[`mat3`](../../../type-aliases/mat3.md)

out
