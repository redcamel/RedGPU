[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanes

# Function: computeFrustumPlanes()

> **computeFrustumPlanes**(`projectionMatrix`, `viewMatrix`, `out?`): `number`[][]

Defined in: [src/math/computeFrustumPlanes.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L28)

투영 행렬과 뷰 행렬을 곱하여 정규화된 6개의 뷰 프러스텀 평면 방정식(`[A, B, C, D]`) 배열을 계산합니다.

### Example
```typescript
const planes = RedGPU.Math.computeFrustumPlanes(projectionMatrix, viewMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 투영 행렬 (`mat4`, 열 우선) |
| `viewMatrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 뷰 행렬 (`mat4`, 열 우선) |
| `out?` | `number`[][] | 결과를 기록할 재사용 2차원 배열 버퍼 (선택 사항, 미지정 시 새 배열 할당) |

## Returns

`number`[][]

6개 평면의 정규화된 계수 배열 (`Array<Array<number>>`, 각 요소는 `[A, B, C, D]`)
