[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateGeometryAABB

# Function: calculateGeometryAABB()

> **calculateGeometryAABB**(`vertexBuffer`): [`AABB`](../classes/AABB.md)

Defined in: [src/bound/math/calculateGeometryAABB.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/math/calculateGeometryAABB.ts#L24)

VertexBuffer 정보를 기반으로 AABB를 계산합니다.


버텍스 버퍼의 각 정점 위치를 순회하며 최소/최대값을 찾아 AABB를 생성합니다.


* ### Example
```typescript
const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | [`VertexBuffer`](../../Resource/classes/VertexBuffer.md) | AABB를 계산할 버텍스 버퍼 객체

## Returns

[`AABB`](../classes/AABB.md)

계산된 AABB 인스턴스

