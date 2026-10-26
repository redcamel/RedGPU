[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / getScreenPoint

# Function: getScreenPoint()

> **getScreenPoint**(`view`, `targetMatrix`): \[`number`, `number`\]

Defined in: [src/math/coordinates/getScreenPoint.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/coordinates/getScreenPoint.ts#L30)

Calculates 2D screen coordinates (`[x, y]`) in CSS pixels using the target's 4x4 world model matrix and `View3D`'s camera and projection matrices.

### Example
```typescript
const [screenX, screenY] = RedGPU.Math.getScreenPoint(view, mesh.modelMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance providing projection and viewport information |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 model matrix of the target to transform (`mat4`, column-major) |

## Returns

\[`number`, `number`\]

Transformed 2D screen coordinate tuple (`[x, y]`, in CSS pixels)

## Throws

Throws an error if `view` is not a `View3D` instance
