[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / worldToLocal

# Function: worldToLocal()

> **worldToLocal**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/worldToLocal.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/coordinates/worldToLocal.ts#L36)

Transforms 3D world coordinates (`[x, y, z]`) into local coordinates (`[x, y, z]`) using the inverse of a 4x4 transformation matrix (`targetMatrix`).

### Example
```typescript
const [localX, localY, localZ] = RedGPU.Math.worldToLocal(mesh.modelMatrix, 10, 5, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 world transformation matrix of the target object (`mat4`, column-major) |
| `x` | `number` | World X coordinate to transform |
| `y` | `number` | World Y coordinate to transform |
| `z` | `number` | World Z coordinate to transform |

## Returns

\[`number`, `number`, `number`\]

Transformed local coordinate tuple (`[x, y, z]`)

## Throws

Throws an error if any of `x`, `y`, or `z` is not a valid number

## See

[World to Local example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
