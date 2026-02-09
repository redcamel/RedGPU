[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/math/mat4ToEuler.ts#L24)

4x4 행렬에서 오일러 각도를 추출합니다.


### Example
```typescript
const euler = RedGPU.math.matToEuler(matrix, [0, 0, 0], 'XYZ');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mat` | `any` | 4x4 행렬
| `dest` | `any` | 결과를 저장할 배열
| `order?` | `any` | 회전 순서 (기본값: 'XYZ')

## Returns

`any`

오일러 각도가 저장된 배열 [x, y, z]

