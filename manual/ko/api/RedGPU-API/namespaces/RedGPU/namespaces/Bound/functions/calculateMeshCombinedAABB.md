[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshCombinedAABB

# Function: calculateMeshCombinedAABB()

> **calculateMeshCombinedAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshCombinedAABB.ts:24](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/bound/math/calculateMeshCombinedAABB.ts#L24)

메시와 모든 자식 메시의 AABB를 통합하여 계산합니다.


메시 계층 구조를 순회하며 모든 바운딩 볼륨을 통합한 새로운 AABB를 반환합니다.


* ### Example
```typescript
const combinedAABB = RedGPU.Bound.calculateMeshCombinedAABB(rootMesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | AABB를 계산할 루트 메시 객체

## Returns

[`AABB`](../classes/AABB.md)

통합된 AABB 인스턴스

