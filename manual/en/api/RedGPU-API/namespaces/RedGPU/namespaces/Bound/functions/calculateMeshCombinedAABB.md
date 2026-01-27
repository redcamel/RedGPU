[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshCombinedAABB

# Function: calculateMeshCombinedAABB()

> **calculateMeshCombinedAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshCombinedAABB.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/math/calculateMeshCombinedAABB.ts#L24)


Calculates a combined AABB encompassing the mesh and all its children.


Traverses the mesh hierarchy and returns a new AABB combining all bounding volumes.

* ### Example
```typescript
const combinedAABB = RedGPU.Bound.calculateMeshCombinedAABB(rootMesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Root mesh object to calculate AABB from |

## Returns

[`AABB`](../classes/AABB.md)


Combined AABB instance
