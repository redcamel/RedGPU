[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/math/quaternionToRotationMat4.ts#L21)

쿼터니언을 회전 행렬로 변환합니다.

### Example
```typescript
RedGPU.math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | 쿼터니언 [x, y, z, w]
| `m` | `any` | 결과를 저장할 4x4 행렬

## Returns

`any`

변환된 회전 행렬
