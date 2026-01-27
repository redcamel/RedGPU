[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/utils/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/utils/math/sortTransparentObjects.ts#L21)

카메라 거리를 기준으로 투명 객체를 원근 거리 내림차순 정렬합니다.


* ### Example
```typescript
const sorted = RedGPU.Util.sortTransparentObjects(camera.position, transparentObjects);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraPos` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 카메라 위치 {x, y, z}
| `cameraPos.x` | `number` | - |
| `cameraPos.y` | `number` | - |
| `cameraPos.z` | `number` | - |
| `objects` | `GPURenderBundle`[] | 정렬할 GPURenderBundle 배열

## Returns

`GPURenderBundle`[]

정렬된 GPURenderBundle 배열

