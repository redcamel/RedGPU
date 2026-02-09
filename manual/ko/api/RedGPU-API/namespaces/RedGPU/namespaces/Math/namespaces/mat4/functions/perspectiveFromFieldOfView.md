[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [mat4](../README.md) / perspectiveFromFieldOfView

# Function: perspectiveFromFieldOfView()

> **perspectiveFromFieldOfView**(`out`, `fov`, `near`, `far`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1326

Generates a perspective projection matrix with the given field of view.
This is primarily useful for generating projection matrices to be used
with the still experiemental WebVR API.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 frustum matrix will be written into |
| `fov` | `any` | Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees |
| `near` | `number` | Near bound of the frustum |
| `far` | `number` | Far bound of the frustum |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
