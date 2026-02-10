[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:27](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/bound/math/calculateMeshAABB.ts#L27)


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
