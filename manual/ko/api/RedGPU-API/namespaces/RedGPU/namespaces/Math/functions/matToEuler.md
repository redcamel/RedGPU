[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/math/mat4ToEuler.ts#L24)

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
