[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / targetTo

# Function: targetTo()

> **targetTo**(`out`, `eye`, `target`, `up`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1377

Generates a matrix that makes something look at something else.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 frustum matrix will be written into |
| `eye` | `ReadonlyVec3` | Position of the viewer |
| `target` | `ReadonlyVec3` | Point the viewer is looking at |
| `up` | `ReadonlyVec3` | vec3 pointing up |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
