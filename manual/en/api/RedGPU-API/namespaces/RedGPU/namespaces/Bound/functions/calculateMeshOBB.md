[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshOBB

# Function: calculateMeshOBB()

> **calculateMeshOBB**(`mesh`): [`OBB`](../classes/OBB.md)

Defined in: [src/bound/math/calculateMeshOBB.ts:25](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/bound/math/calculateMeshOBB.ts#L25)


Calculates world-space OBB by applying mesh modelMatrix.


Returns an OBB with center, half-extents, and orientation based on geometry volume.

* ### Example
```typescript
const meshOBB = RedGPU.Bound.calculateMeshOBB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Mesh object to calculate OBB from |

## Returns

[`OBB`](../classes/OBB.md)


Calculated world-space OBB instance
