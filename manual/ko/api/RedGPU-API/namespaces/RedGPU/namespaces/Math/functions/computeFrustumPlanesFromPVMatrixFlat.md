[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / computeFrustumPlanesFromPVMatrixFlat

# Function: computeFrustumPlanesFromPVMatrixFlat()

> **computeFrustumPlanesFromPVMatrixFlat**(`m`, `out?`): `Float32Array`

Defined in: [src/math/computeFrustumPlanes.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/computeFrustumPlanes.ts#L251)

투영-뷰 결합 행렬(WebGPU `[0, 1]` 깊이 규격)로부터 6개 프러스텀 평면(Left, Right, Bottom, Top, Near, Far)을 1차원 `Float32Array`(길이 24)로 계산합니다.

### Example
```typescript
const planesFlat = RedGPU.Math.computeFrustumPlanesFromPVMatrixFlat(pvMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `m` | [`mat4`](../type-aliases/mat4.md) | 투영-뷰 결합 4x4 행렬 (`mat4`, 열 우선) |
| `out?` | `Float32Array` | 결과를 기록할 재사용 `Float32Array(24)` 버퍼 (선택 사항, 미지정 시 새 버퍼 할당) |

## Returns

`Float32Array`

평탄화된 6개 평면 계수 버퍼 (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
