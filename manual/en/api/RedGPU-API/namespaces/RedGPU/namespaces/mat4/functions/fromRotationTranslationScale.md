[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / fromRotationTranslationScale

# Function: fromRotationTranslationScale()

> **fromRotationTranslationScale**(`out`, `q`, `v`, `s`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1213

Creates a matrix from a quaternion rotation, vector translation and vector scale
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, vec);
    let quatMat = mat4.create();
    quat4.toMat4(quat, quatMat);
    mat4.multiply(dest, quatMat);
    mat4.scale(dest, scale)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `q` | `any` | Rotation quaternion |
| `v` | `ReadonlyVec3` | Translation vector |
| `s` | `ReadonlyVec3` | Scaling vector |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
