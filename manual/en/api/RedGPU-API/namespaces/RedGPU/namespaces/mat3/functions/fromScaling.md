[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat3](../README.md) / fromScaling

# Function: fromScaling()

> **fromScaling**(`out`, `v`): [`mat3`](../../../type-aliases/mat3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:793

Creates a matrix from a vector scaling
This is equivalent to (but much faster than):

    mat3.identity(dest);
    mat3.scale(dest, dest, vec);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat3`](../../../type-aliases/mat3.md) | mat3 receiving operation result |
| `v` | `ReadonlyVec2` | Scaling vector |

## Returns

[`mat3`](../../../type-aliases/mat3.md)

out
