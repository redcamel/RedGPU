[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getScreenPoint

# Function: getScreenPoint()

> **getScreenPoint**(`view`, `targetMatrix`): \[`number`, `number`\]

Defined in: [src/utils/math/coordinates/getScreenPoint.ts:33](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/coordinates/getScreenPoint.ts#L33)


Calculates 2D screen pixel coordinates from a 3D model matrix.


Converts to screen coordinates based on View3D's camera and projection.

* ### Example
```typescript
const [px, py] = RedGPU.Util.getScreenPoint(view, mesh.modelMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance to use for conversion |
| `targetMatrix` | [`mat4`](../../../type-aliases/mat4.md) | Model matrix of the target to convert |

## Returns

\[`number`, `number`\]


Converted screen pixel coordinates [x, y]

## Throws


Throws Error if view is not a View3D instance
