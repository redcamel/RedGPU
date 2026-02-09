[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/math/calculateNormals.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/calculateNormals.ts#L24)

정점 배열과 인덱스 배열을 기반으로 노멀 벡터를 계산합니다.


삼각형 면 단위로 노멀을 구한 뒤 평균화 및 정규화하여 반환합니다.


### Example
```typescript
const normals = RedGPU.math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] | 정점 위치 배열 (x, y, z 순서)
| `indexArray` | `number`[] | 삼각형 정점 인덱스 배열

## Returns

`number`[]

계산된 정점 노멀 배열

