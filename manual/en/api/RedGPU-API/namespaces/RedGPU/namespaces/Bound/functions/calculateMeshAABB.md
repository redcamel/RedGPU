[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:27](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/bound/math/calculateMeshAABB.ts#L27)


Calculates mesh world-space AABB from its local AABB.


Transforms the geometry volume using modelMatrix and returns a world-space AABB.

* ### Example
```typescript
const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Mesh object to calculate AABB from |

## Returns

[`AABB`](../classes/AABB.md)


Calculated world-space AABB instance
