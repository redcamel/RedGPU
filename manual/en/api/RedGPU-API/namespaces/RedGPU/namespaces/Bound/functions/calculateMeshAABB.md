[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`, `targetAABB?`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/bound/math/calculateMeshAABB.ts#L24)

Calculates the world-space Axis-Aligned Bounding Box (`AABB`) by applying `modelMatrix` to the local geometry volume of a mesh.

### Example
```typescript
const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target `Mesh` instance to calculate the world-space `AABB` from |
| `targetAABB?` | [`AABB`](../classes/AABB.md) | Target `AABB` instance to store the result in-place (creates a new instance if omitted) |

## Returns

[`AABB`](../classes/AABB.md)

Calculated world-space `AABB` instance
