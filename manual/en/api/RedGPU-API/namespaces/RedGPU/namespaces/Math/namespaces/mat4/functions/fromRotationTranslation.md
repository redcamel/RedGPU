[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / fromRotationTranslation

# Function: fromRotationTranslation()

> **fromRotationTranslation**(`out`, `q`, `v`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1176

Creates a matrix from a quaternion rotation and vector translation
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, dest, vec);
    let quatMat = mat4.create();
    mat4.fromQuat(quatMat, quat);
    mat4.multiply(dest, dest, quatMat);

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 receiving operation result |
| `q` | [`quat`](../../../type-aliases/quat.md) | Rotation quaternion |
| `v` | `ReadonlyVec3` | Translation vector |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
