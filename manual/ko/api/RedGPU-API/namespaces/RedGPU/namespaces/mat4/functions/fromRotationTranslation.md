[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / fromRotationTranslation

# Function: fromRotationTranslation()

> **fromRotationTranslation**(`out`, `q`, `v`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1156

Creates a matrix from a quaternion rotation and vector translation
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, vec);
    let quatMat = mat4.create();
    quat4.toMat4(quat, quatMat);
    mat4.multiply(dest, quatMat);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `q` | `any` | Rotation quaternion |
| `v` | `ReadonlyVec3` | Translation vector |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
