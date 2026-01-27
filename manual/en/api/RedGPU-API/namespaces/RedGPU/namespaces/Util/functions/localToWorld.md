[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / localToWorld

# Function: localToWorld()

> **localToWorld**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/utils/math/coordinates/localToWorld.ts:34](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/coordinates/localToWorld.ts#L34)


Converts local coordinates to world coordinates.

* ### Example
```typescript
const worldPos = RedGPU.Util.localToWorld(mesh.modelMatrix, 0, 1, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 4x4 matrix to use for transformation |
| `x` | `number` | Local x coordinate |
| `y` | `number` | Local y coordinate |
| `z` | `number` | Local z coordinate |

## Returns

\[`number`, `number`, `number`\]


Converted world coordinates [x, y, z]

## Throws


Throws Error if coordinates are not numbers
