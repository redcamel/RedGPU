[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / perspective

# Function: perspective()

> **perspective**(`out`, `fovy`, `aspect`, `near`, `far`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1458

Generates a perspective projection matrix with the given bounds.
The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
which matches WebGL/OpenGL's clip volume.
Passing null/undefined/no value for far will generate infinite projection matrix.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 frustum matrix will be written into |
| `fovy` | `number` | Vertical field of view in radians |
| `aspect` | `number` | Aspect ratio. typically viewport width/height |
| `near` | `number` | Near bound of the frustum |
| `far` | `number` | Far bound of the frustum, can be null or Infinity |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
