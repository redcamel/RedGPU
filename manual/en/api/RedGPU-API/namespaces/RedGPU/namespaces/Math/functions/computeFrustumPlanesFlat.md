[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanesFlat

# Function: computeFrustumPlanesFlat()

> **computeFrustumPlanesFlat**(`projectionMatrix`, `viewMatrix`, `out?`): `Float32Array`

Defined in: [src/math/computeFrustumPlanes.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L104)

Computes 6 normalized view frustum planes as a 1D `Float32Array` (length 24) from projection and view matrices.

### Example
```typescript
const planesFlat = RedGPU.Math.computeFrustumPlanesFlat(projectionMatrix, viewMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 projection matrix (`mat4`, column-major) |
| `viewMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 view matrix (`mat4`, column-major) |
| `out?` | `Float32Array` | Reusable `Float32Array(24)` buffer to write the result (optional, allocates a new buffer if omitted) |

## Returns

`Float32Array`

Flattened 6-plane coefficient buffer (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
