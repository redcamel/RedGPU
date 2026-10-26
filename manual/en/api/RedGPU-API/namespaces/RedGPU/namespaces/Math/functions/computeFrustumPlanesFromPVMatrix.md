[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanesFromPVMatrix

# Function: computeFrustumPlanesFromPVMatrix()

> **computeFrustumPlanesFromPVMatrix**(`m`, `out?`): `number`[][]

Defined in: [src/math/computeFrustumPlanes.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L178)

Extracts and normalizes 6 frustum planes (Left, Right, Bottom, Top, Near, Far) from a combined projection-view matrix (WebGPU `[0, 1]` depth standard).

### Example
```typescript
const planes = RedGPU.Math.computeFrustumPlanesFromPVMatrix(pvMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `m` | [`mat4`](../type-aliases/mat4.md) | Combined projection-view 4x4 matrix (`mat4`, column-major) |
| `out?` | `number`[][] | Reusable 2D array buffer to write the result (optional, allocates a new array if omitted) |

## Returns

`number`[][]

Array of normalized coefficients for 6 planes (`Array<Array<number>>`, each element is `[A, B, C, D]`)
