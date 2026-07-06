[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:24](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/bound/math/calculateMeshAABB.ts#L24)

메시의 로컬 AABB를 월드 공간 AABB로 변환하여 계산합니다.

메시의 지오메트리 볼륨을 modelMatrix로 변환하여 월드 기준 AABB를 반환합니다.

* ### Example
```typescript
const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | AABB를 계산할 메시 객체

## Returns

[`AABB`](../classes/AABB.md)

계산된 월드 기준 AABB 인스턴스
