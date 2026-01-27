[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [mat4](../README.md) / orthoZO

# Function: orthoZO()

> **orthoZO**(`out`, `left`, `right`, `bottom`, `top`, `near`, `far`): [`mat4`](../../../type-aliases/mat4.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1356

Generates a orthogonal projection matrix with the given bounds.
The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
which matches WebGPU/Vulkan/DirectX/Metal's clip volume.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`mat4`](../../../type-aliases/mat4.md) | mat4 frustum matrix will be written into |
| `left` | `number` | Left bound of the frustum |
| `right` | `number` | Right bound of the frustum |
| `bottom` | `number` | Bottom bound of the frustum |
| `top` | `number` | Top bound of the frustum |
| `near` | `number` | Near bound of the frustum |
| `far` | `number` | Far bound of the frustum |

## Returns

[`mat4`](../../../type-aliases/mat4.md)

out
