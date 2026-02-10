[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshAABB

# Function: calculateMeshAABB()

> **calculateMeshAABB**(`mesh`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateMeshAABB.ts:27](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/bound/math/calculateMeshAABB.ts#L27)

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

