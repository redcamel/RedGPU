[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/math/quaternionToRotationMat4.ts#L21)

쿼터니언(`[x, y, z, w]`)을 열 우선(Column-major) 4x4 회전 행렬로 변환합니다.

### Example
```typescript
RedGPU.Math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | 쿼터니언 배열 (`[x, y, z, w]`) |
| `m` | `any` | 결과를 기록할 4x4 행렬 버퍼 |

## Returns

`any`

변환된 4x4 회전 행렬 (`m`)
