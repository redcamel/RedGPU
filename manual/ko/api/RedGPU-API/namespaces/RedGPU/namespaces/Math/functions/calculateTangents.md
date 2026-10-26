[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`): `Float32Array`

Defined in: [src/math/calculateTangents.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/calculateTangents.ts#L166)

정점 위치, 법선, UV, 인덱스 배열로부터 MikkTSpace 알고리즘 기반의 정점 탄젠트 벡터(`Float32Array`)를 계산하여 반환합니다.

### Example
```typescript
const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 정점 위치 배열 (`[x, y, z, ...]`) |
| `normals` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`) |
| `uvs` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | UV 텍스처 좌표 배열 (`[u, v, ...]`) |
| `indices` | `number`[] \| `Uint32Array`\<`ArrayBufferLike`\> | 삼각형 정점 인덱스 배열 |

## Returns

`Float32Array`

계산된 정점 탄젠트 배열 (`Float32Array`, `[tx, ty, tz, w, ...]`)
