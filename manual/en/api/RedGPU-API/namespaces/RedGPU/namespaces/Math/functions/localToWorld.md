[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / localToWorld

# Function: localToWorld()

> **localToWorld**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/localToWorld.ts:34](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/coordinates/localToWorld.ts#L34)


Converts local coordinates to world coordinates.

### Example
```typescript
const worldPos = RedGPU.math.localToWorld(mesh.modelMatrix, 0, 1, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 matrix to use for transformation |
| `x` | `number` | Local x coordinate |
| `y` | `number` | Local y coordinate |
| `z` | `number` | Local z coordinate |

## Returns

\[`number`, `number`, `number`\]


Converted world coordinates [x, y, z]

## Throws


Throws Error if coordinates are not numbers
