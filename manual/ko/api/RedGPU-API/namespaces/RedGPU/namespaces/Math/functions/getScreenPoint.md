[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / getScreenPoint

# Function: getScreenPoint()

> **getScreenPoint**(`view`, `targetMatrix`): \[`number`, `number`\]

Defined in: [src/math/coordinates/getScreenPoint.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/coordinates/getScreenPoint.ts#L30)

대상의 4x4 월드 모델 행렬과 `View3D`의 카메라·투영 행렬을 사용하여 CSS 픽셀 단위의 2D 화면 좌표(`[x, y]`)를 계산합니다.

### Example
```typescript
const [screenX, screenY] = RedGPU.Math.getScreenPoint(view, mesh.modelMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 투영 및 뷰포트 정보를 제공하는 `View3D` 인스턴스 |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 변환할 대상의 4x4 모델 행렬 (`mat4`, 열 우선) |

## Returns

\[`number`, `number`\]

변환된 2D 화면 좌표 튜플 (`[x, y]`, CSS 픽셀 단위)

## Throws

`view`가 `View3D` 인스턴스가 아닐 경우 에러 발생
