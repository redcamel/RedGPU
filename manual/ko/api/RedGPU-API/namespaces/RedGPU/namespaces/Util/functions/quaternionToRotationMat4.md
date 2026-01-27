[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/utils/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/utils/math/quaternionToRotationMat4.ts#L21)

쿼터니언을 회전 행렬로 변환합니다.


* ### Example
```typescript
RedGPU.Util.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | 쿼터니언 [x, y, z, w]
| `m` | `any` | 결과를 저장할 4x4 행렬

## Returns

`any`

변환된 회전 행렬

