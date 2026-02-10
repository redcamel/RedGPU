[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeViewFrustumPlanes

# Function: computeViewFrustumPlanes()

> **computeViewFrustumPlanes**(`projectionMatrix`, `cameraMatrix`): `number`[][]

Defined in: [src/math/computeViewFrustumPlanes.ts:27](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/math/computeViewFrustumPlanes.ts#L27)


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
| `cameraMatrix` | [`mat4`](../type-aliases/mat4.md) | Camera matrix |

## Returns

`number`[][]


Array of [A, B, C, D] for 6 planes
