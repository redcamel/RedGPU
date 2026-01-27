[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / lookAt

# Function: lookAt()

> **lookAt**(`out`, `eye`, `center`, `up`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1337

Generates a look-at matrix with the given eye position, focal point, and up axis.
If you want a matrix that actually makes an object look at another object, you should use targetTo instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 frustum matrix will be written into |
| `eye` | `ReadonlyVec3` | Position of the viewer |
| `center` | `ReadonlyVec3` | Point the viewer is looking at |
| `up` | `ReadonlyVec3` | vec3 pointing up |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
