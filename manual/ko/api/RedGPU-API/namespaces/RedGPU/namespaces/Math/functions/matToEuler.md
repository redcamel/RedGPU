[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/mat4ToEuler.ts#L24)

열 우선(Column-major) 4x4 회전 행렬의 상위 3x3 성분에서 라디안(Radian) 단위의 오일러 각도를 추출합니다.

### Example
```typescript
const euler = RedGPU.Math.matToEuler(matrix, [0, 0, 0], 'XYZ');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mat` | `any` | 스케일이 제거된 4x4 회전 행렬 (열 우선) |
| `dest` | `any` | 결과를 저장할 배열 (기본값: `[0, 0, 0]`) |
| `order?` | `any` | 회전 축 순서 (`'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'`, `'XZY'`, 기본값: `'XYZ'`) |

## Returns

`any`

라디안 단위의 오일러 회전 각도 배열 (`[x, y, z]`)
