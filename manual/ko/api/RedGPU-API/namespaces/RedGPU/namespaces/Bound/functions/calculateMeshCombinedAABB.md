[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshCombinedAABB

# Function: calculateMeshCombinedAABB()

> **calculateMeshCombinedAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshCombinedAABB.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/bound/math/calculateMeshCombinedAABB.ts#L21)

메시와 모든 자식 메시의 바운딩 볼륨을 통합한 AABB를 계산합니다.

### Example
```typescript
const combinedAABB = RedGPU.Bound.calculateMeshCombinedAABB(rootMesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | AABB를 계산할 루트 메시 객체 |

## Returns

[`AABB`](../classes/AABB.md)

통합된 AABB 인스턴스
