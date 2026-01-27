[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / worldToLocal

# Function: worldToLocal()

> **worldToLocal**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/utils/math/coordinates/worldToLocal.ts:35](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/coordinates/worldToLocal.ts#L35)


Converts world coordinates to local coordinates.

* ### Example
```typescript
const localPos = RedGPU.Util.worldToLocal(mesh.modelMatrix, 10, 5, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 4x4 matrix to use for transformation |
| `x` | `number` | World x coordinate |
| `y` | `number` | World y coordinate |
| `z` | `number` | World z coordinate |

## Returns

\[`number`, `number`, `number`\]


Converted local coordinates [x, y, z]

## Throws


Throws Error if coordinates are not numbers
