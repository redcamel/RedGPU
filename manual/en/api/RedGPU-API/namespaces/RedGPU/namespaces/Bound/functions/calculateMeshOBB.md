[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshOBB

# Function: calculateMeshOBB()

> **calculateMeshOBB**(`mesh`): [`OBB`](../classes/OBB.md)

Defined in: [src/bound/math/calculateMeshOBB.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/bound/math/calculateMeshOBB.ts#L25)

Calculates the world-space OBB by applying the mesh's `modelMatrix`.

Returns an OBB containing the transformed center, half-extents, and orientation matrix based on geometry volume.

### Example
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
