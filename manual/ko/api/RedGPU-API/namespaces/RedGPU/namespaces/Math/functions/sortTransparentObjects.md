[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/sortTransparentObjects.ts#L21)

카메라 위치로부터의 거리 제곱을 기준으로 투명 렌더링 번들(`GPURenderBundle`) 배열을 내림차순(먼 것부터 가까운 순서) 정렬합니다.

### Example
```typescript
const sortedBundles = RedGPU.Math.sortTransparentObjects(camera, transparentBundles);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraPos` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 카메라의 3D 월드 좌표 (`{ x: number, y: number, z: number }`) |
| `cameraPos.x` | `number` | - |
| `cameraPos.y` | `number` | - |
| `cameraPos.z` | `number` | - |
| `objects` | `GPURenderBundle`[] | 정렬할 `Array<GPURenderBundle>` 배열 |

## Returns

`GPURenderBundle`[]

카메라 거리 내림차순으로 정렬된 `Array<GPURenderBundle>` 배열
