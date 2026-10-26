[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / localToWorld

# Function: localToWorld()

> **localToWorld**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/localToWorld.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/coordinates/localToWorld.ts#L35)

Transforms local coordinates (`[x, y, z]`) into 3D world coordinates (`[x, y, z]`) using a 4x4 transformation matrix (`targetMatrix`).

### Example
```typescript
const [worldX, worldY, worldZ] = RedGPU.Math.localToWorld(mesh.modelMatrix, 0, 1, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 world transformation matrix of the target object (`mat4`, column-major) |
| `x` | `number` | Local X coordinate to transform |
| `y` | `number` | Local Y coordinate to transform |
| `z` | `number` | Local Z coordinate to transform |

## Returns

\[`number`, `number`, `number`\]

Transformed 3D world coordinate tuple (`[x, y, z]`)

## Throws

Throws an error if any of `x`, `y`, or `z` is not a valid number

## See

[World to Local example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
