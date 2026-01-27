[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / computeViewFrustumPlanes

# Function: computeViewFrustumPlanes()

> **computeViewFrustumPlanes**(`projectionMatrix`, `cameraMatrix`): `number`[][]

Defined in: [src/utils/math/computeViewFrustumPlanes.ts:27](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/utils/math/computeViewFrustumPlanes.ts#L27)

프로젝션 및 카메라 행렬로부터 6개의 뷰 프러스텀 평면을 계산합니다.


각 평면의 방정식을 [A, B, C, D] 형태로 정규화하여 반환합니다.


* ### Example
```typescript
const planes = RedGPU.Util.computeViewFrustumPlanes(projectionMTX, cameraMTX);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 프로젝션 행렬
| `cameraMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 카메라 행렬

## Returns

`number`[][]

6개 평면의 [A, B, C, D] 배열

