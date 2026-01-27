[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`, `existingTangents?`): `number`[]

Defined in: [src/utils/math/calculateTangents.ts:30](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/calculateTangents.ts#L30)

MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산합니다.


* ### Example
```typescript
const tangents = RedGPU.Util.calculateTangents(vertices, normals, uvs, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] | 정점 위치 배열
| `normals` | `number`[] | 노멀 벡터 배열
| `uvs` | `number`[] | UV 좌표 배열
| `indices` | `number`[] | 인덱스 배열
| `existingTangents?` | `number`[] | 기존 탄젠트 배열 (선택적)

## Returns

`number`[]

계산된 탄젠트 배열 [x, y, z, w, ...]

