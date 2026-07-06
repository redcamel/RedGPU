[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / worldToLocal

# Function: worldToLocal()

> **worldToLocal**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/worldToLocal.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/math/coordinates/worldToLocal.ts#L35)

Converts world coordinates to local coordinates.

### Example
```typescript
const localPos = RedGPU.math.worldToLocal(mesh.modelMatrix, 10, 5, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 matrix to use for transformation |
| `x` | `number` | World x coordinate |
| `y` | `number` | World y coordinate |
| `z` | `number` | World z coordinate |

## Returns

\[`number`, `number`, `number`\]

Converted local coordinates [x, y, z]

## Throws

Throws Error if coordinates are not numbers
