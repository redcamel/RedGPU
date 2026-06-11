[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateGeometryAABB

# Function: calculateGeometryAABB()

> **calculateGeometryAABB**(`vertexBuffer`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateGeometryAABB.ts:24](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/bound/math/calculateGeometryAABB.ts#L24)

Calculates AABB based on VertexBuffer information.

Iterates through vertex positions to find min/max values and create an AABB.

* ### Example
```typescript
const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | [`VertexBuffer`](../../Resource/classes/VertexBuffer.md) | Vertex buffer object to calculate AABB from |

## Returns

[`AABB`](../classes/AABB.md)

Calculated AABB instance
