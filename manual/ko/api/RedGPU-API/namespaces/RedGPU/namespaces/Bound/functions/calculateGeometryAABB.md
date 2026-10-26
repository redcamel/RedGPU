[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateGeometryAABB

# Function: calculateGeometryAABB()

> **calculateGeometryAABB**(`vertexBuffer`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateGeometryAABB.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/bound/math/calculateGeometryAABB.ts#L21)

`VertexBuffer`의 정점 위치 데이터를 순회하여 로컬 축 정렬 경계 상자(`AABB`)를 계산합니다.

### Example
```typescript
const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | [`VertexBuffer`](../../Resource/classes/VertexBuffer.md) | `AABB`를 계산할 대상 `VertexBuffer` 인스턴스 |

## Returns

[`AABB`](../classes/AABB.md)

계산된 로컬 `AABB` 인스턴스
