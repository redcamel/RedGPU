[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanes

# Function: computeFrustumPlanes()

> **computeFrustumPlanes**(`projectionMatrix`, `viewMatrix`, `out?`): `number`[][]

Defined in: [src/math/computeFrustumPlanes.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/computeFrustumPlanes.ts#L28)

Multiplies the projection and view matrices to compute an array of 6 normalized view frustum plane equations (`[A, B, C, D]`).

### Example
```typescript
const planes = RedGPU.Math.computeFrustumPlanes(projectionMatrix, viewMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 projection matrix (`mat4`, column-major) |
| `viewMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 view matrix (`mat4`, column-major) |
| `out?` | `number`[][] | Reusable 2D array buffer to write the result (optional, allocates a new array if omitted) |

## Returns

`number`[][]

Array of normalized coefficients for 6 planes (`Array<Array<number>>`, each element is `[A, B, C, D]`)
