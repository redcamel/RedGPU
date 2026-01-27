[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / fromRotationTranslationScaleOrigin

# Function: fromRotationTranslationScaleOrigin()

> **fromRotationTranslationScaleOrigin**(`out`, `q`, `v`, `s`, `o`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1234

Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, vec);
    mat4.translate(dest, origin);
    let quatMat = mat4.create();
    quat4.toMat4(quat, quatMat);
    mat4.multiply(dest, quatMat);
    mat4.scale(dest, scale)
    mat4.translate(dest, negativeOrigin);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `q` | `any` | Rotation quaternion |
| `v` | `ReadonlyVec3` | Translation vector |
| `s` | `ReadonlyVec3` | Scaling vector |
| `o` | `ReadonlyVec3` | The origin vector around which to scale and rotate |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
