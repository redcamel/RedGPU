[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / screenToWorld

# Function: screenToWorld()

> **screenToWorld**(`screenX`, `screenY`, `view`): `number`[]

Defined in: [src/math/coordinates/screenToWorld.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/coordinates/screenToWorld.ts#L34)

화면의 2D 픽셀 좌표(`screenX`, `screenY`)를 뷰(`AView`)의 역 투영-뷰 행렬을 통해 3D 월드 좌표(`[x, y, z]`)로 변환합니다.

### Example
```typescript
const [worldX, worldY, worldZ] = RedGPU.Math.screenToWorld(mouseX, mouseY, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 (CSS 픽셀 단위) |
| `screenY` | `number` | 화면 Y 좌표 (CSS 픽셀 단위) |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | 변환 기준이 되는 `AView` 인스턴스 |

## Returns

`number`[]

변환된 3D 월드 좌표 배열 (`[x, y, z]`)

## See

[Screen to World example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/screenToWorld/)
