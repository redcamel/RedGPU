[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`, `targetAABB?`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/math/calculateMeshAABB.ts#L24)

메시의 로컬 지오메트리 볼륨에 `modelMatrix`를 적용하여 월드 공간 축 정렬 경계 상자(`AABB`)를 계산합니다.

### Example
```typescript
const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | 월드 `AABB`를 계산할 대상 `Mesh` 인스턴스 |
| `targetAABB?` | [`AABB`](../classes/AABB.md) | 결과를 제자리(In-place)에 저장할 대상 `AABB` 인스턴스 (생략 시 새 인스턴스 생성) |

## Returns

[`AABB`](../classes/AABB.md)

계산된 월드 공간 `AABB` 인스턴스
