[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getScreenPoint

# Function: getScreenPoint()

> **getScreenPoint**(`view`, `targetMatrix`): \[`number`, `number`\]

Defined in: [src/utils/math/coordinates/getScreenPoint.ts:33](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/utils/math/coordinates/getScreenPoint.ts#L33)

3D 모델 행렬을 이용해 화면 상의 2D 픽셀 좌표를 계산합니다.


View3D의 카메라 및 프로젝션 정보를 바탕으로 화면 좌표로 변환합니다.


* ### Example
```typescript
const [px, py] = RedGPU.Util.getScreenPoint(view, mesh.modelMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 변환에 사용할 View3D 인스턴스
| `targetMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 변환할 대상의 모델 행렬

## Returns

\[`number`, `number`\]

변환된 화면 픽셀 좌표 [x, y]


## Throws

view가 View3D 인스턴스가 아니면 Error 발생

