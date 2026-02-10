[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/math/quaternionToRotationMat4.ts#L21)

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

