[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / fromRotationTranslationScaleOrigin

# Function: fromRotationTranslationScaleOrigin()

> **fromRotationTranslationScaleOrigin**(`out`, `q`, `v`, `s`, `o`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1264

Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, dest, vec);
    mat4.translate(dest, dest, origin);
    let quatMat = mat4.create();
    mat4.fromQuat(quatMat, quat);
    mat4.multiply(dest, dest, quatMat);
    mat4.scale(dest, dest, scale)
    mat4.translate(dest, dest, negativeOrigin);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `q` | [`quat`](../../../type-aliases/quat.md) | Rotation quaternion |
| `v` | `ReadonlyVec3` | Translation vector |
| `s` | `ReadonlyVec3` | Scaling vector |
| `o` | `ReadonlyVec3` | The origin vector around which to scale and rotate |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
