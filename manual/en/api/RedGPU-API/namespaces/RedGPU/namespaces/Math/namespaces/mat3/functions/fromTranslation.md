[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat3](../README.md) / fromTranslation

# Function: fromTranslation()

> **fromTranslation**(`out`, `v`): [`mat3`](../../../type-aliases/mat3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:769

Creates a matrix from a vector translation
This is equivalent to (but much faster than):

    mat3.identity(dest);
    mat3.translate(dest, dest, vec);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat3`](../../../type-aliases/mat3.md) | mat3 receiving operation result |
| `v` | `ReadonlyVec2` | Translation vector |

## Returns

[`mat3`](../../../type-aliases/mat3.md)

out
