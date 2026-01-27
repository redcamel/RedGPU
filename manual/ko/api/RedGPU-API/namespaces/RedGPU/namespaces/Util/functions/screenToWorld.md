[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / screenToWorld

# Function: screenToWorld()

> **screenToWorld**(`screenX`, `screenY`, `view`): `number`[]

Defined in: [src/utils/math/coordinates/screenToWorld.ts:36](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/utils/math/coordinates/screenToWorld.ts#L36)

화면 상의 2D 픽셀 좌표를 3D 월드 좌표로 변환합니다.


View3D의 카메라 및 프로젝션 정보를 바탕으로 3D 공간의 위치를 계산합니다.


* ### Example
```typescript
const worldPos = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 (픽셀)
| `screenY` | `number` | 화면 Y 좌표 (픽셀)
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | 변환에 사용할 AView 인스턴스

## Returns

`number`[]

변환된 3D 월드 좌표 [x, y, z]

