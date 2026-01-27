[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / computeViewFrustumPlanes

# Function: computeViewFrustumPlanes()

> **computeViewFrustumPlanes**(`projectionMatrix`, `cameraMatrix`): `number`[][]

Defined in: [src/utils/math/computeViewFrustumPlanes.ts:27](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/computeViewFrustumPlanes.ts#L27)


Computes 6 view frustum planes from projection and camera matrices.


Returns equations of each plane normalized in [A, B, C, D] format.

* ### Example
```typescript
const planes = RedGPU.Util.computeViewFrustumPlanes(projectionMTX, cameraMTX);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../../../type-aliases/mat4.md) | Projection matrix |
| `cameraMatrix` | [`mat4`](../../../type-aliases/mat4.md) | Camera matrix |

## Returns

`number`[][]


Array of [A, B, C, D] for 6 planes
