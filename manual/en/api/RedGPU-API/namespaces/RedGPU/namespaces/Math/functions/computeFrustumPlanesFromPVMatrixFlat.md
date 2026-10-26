[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanesFromPVMatrixFlat

# Function: computeFrustumPlanesFromPVMatrixFlat()

> **computeFrustumPlanesFromPVMatrixFlat**(`m`, `out?`): `Float32Array`

Defined in: [src/math/computeFrustumPlanes.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L251)

Computes 6 frustum planes (Left, Right, Bottom, Top, Near, Far) as a 1D `Float32Array` (length 24) from a combined projection-view matrix (WebGPU `[0, 1]` depth standard).

### Example
```typescript
const planesFlat = RedGPU.Math.computeFrustumPlanesFromPVMatrixFlat(pvMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `m` | [`mat4`](../type-aliases/mat4.md) | Combined projection-view 4x4 matrix (`mat4`, column-major) |
| `out?` | `Float32Array` | Reusable `Float32Array(24)` buffer to write the result (optional, allocates a new buffer if omitted) |

## Returns

`Float32Array`

Flattened 6-plane coefficient buffer (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
