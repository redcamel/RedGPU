[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / computeViewFrustumPlanes

# Function: computeViewFrustumPlanes()

> **computeViewFrustumPlanes**(`projectionMatrix`, `cameraMatrix`): `number`[][]

Defined in: [src/utils/math/computeViewFrustumPlanes.ts:27](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/utils/math/computeViewFrustumPlanes.ts#L27)

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

