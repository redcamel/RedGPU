[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/math/calculateNormals.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/calculateNormals.ts#L21)

정점 위치 배열과 삼각형 인덱스 배열로부터 정규화된 정점 법선(Normal) 벡터 배열을 계산합니다.

### Example
```typescript
const normals = RedGPU.Math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] | 정점 위치 배열 (`[x, y, z, ...]`) |
| `indexArray` | `number`[] | 삼각형 정점 인덱스 배열 (비어 있을 경우 정점 순서대로 처리) |

## Returns

`number`[]

정규화된 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`)
