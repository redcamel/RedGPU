[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `Float32Array`

Defined in: [src/math/calculateNormals.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/math/calculateNormals.ts#L21)

정점 위치 배열과 삼각형 인덱스 배열로부터 정규화된 정점 법선(Normal) 벡터 배열을 계산합니다.

### Example
```typescript
const normals = RedGPU.Math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 정점 위치 배열 (`[x, y, z, ...]`) |
| `indexArray` | `number`[] \| `Uint16Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> | 삼각형 정점 인덱스 배열 (비어 있을 경우 정점 순서대로 처리) |

## Returns

`Float32Array`

정규화된 정점 법선 벡터 배열 (`Float32Array`, `[nx, ny, nz, ...]`)
