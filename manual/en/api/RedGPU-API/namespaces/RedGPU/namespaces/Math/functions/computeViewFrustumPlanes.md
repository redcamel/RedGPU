[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeViewFrustumPlanes

# Function: computeViewFrustumPlanes()

> **computeViewFrustumPlanes**(`projectionMatrix`, `viewMatrix`): `number`[][]

Defined in: [src/math/computeViewFrustumPlanes.ts:27](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/math/computeViewFrustumPlanes.ts#L27)

Computes 6 view frustum planes from projection and camera matrices.

Returns equations of each plane normalized in [A, B, C, D] format.

### Example
```typescript
const planes = RedGPU.math.computeViewFrustumPlanes(projectionMTX, cameraMTX);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../type-aliases/mat4.md) | Projection matrix |
| `viewMatrix` | [`mat4`](../type-aliases/mat4.md) | Camera matrix |

## Returns

`number`[][]

Array of [A, B, C, D] for 6 planes
