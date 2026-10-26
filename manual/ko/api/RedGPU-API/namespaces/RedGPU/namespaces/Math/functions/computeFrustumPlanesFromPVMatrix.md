[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanesFromPVMatrix

# Function: computeFrustumPlanesFromPVMatrix()

> **computeFrustumPlanesFromPVMatrix**(`m`, `out?`): `number`[][]

Defined in: [src/math/computeFrustumPlanes.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L178)

투영-뷰 결합 행렬(WebGPU `[0, 1]` 깊이 규격)로부터 6개 프러스텀 평면(Left, Right, Bottom, Top, Near, Far)을 추출 및 정규화합니다.

### Example
```typescript
const planes = RedGPU.Math.computeFrustumPlanesFromPVMatrix(pvMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `m` | [`mat4`](../type-aliases/mat4.md) | 투영-뷰 결합 4x4 행렬 (`mat4`, 열 우선) |
| `out?` | `number`[][] | 결과를 기록할 재사용 2차원 배열 버퍼 (선택 사항, 미지정 시 새 배열 할당) |

## Returns

`number`[][]

6개 평면의 정규화된 계수 배열 (`Array<Array<number>>`, 각 요소는 `[A, B, C, D]`)
