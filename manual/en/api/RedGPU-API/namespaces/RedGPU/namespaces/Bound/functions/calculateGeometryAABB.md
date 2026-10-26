[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateGeometryAABB

# Function: calculateGeometryAABB()

> **calculateGeometryAABB**(`vertexBuffer`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateGeometryAABB.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/bound/math/calculateGeometryAABB.ts#L21)

Calculates a local Axis-Aligned Bounding Box (`AABB`) by iterating over the vertex position data of a `VertexBuffer`.

### Example
```typescript
const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | [`VertexBuffer`](../../Resource/classes/VertexBuffer.md) | Target `VertexBuffer` instance to calculate the `AABB` from |

## Returns

[`AABB`](../classes/AABB.md)

Calculated local `AABB` instance
