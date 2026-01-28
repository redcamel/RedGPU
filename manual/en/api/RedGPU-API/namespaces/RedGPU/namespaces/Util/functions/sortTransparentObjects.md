[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/utils/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/utils/math/sortTransparentObjects.ts#L21)


Sorts transparent objects by distance from camera (descending).

* ### Example
```typescript
const sorted = RedGPU.Util.sortTransparentObjects(camera.position, transparentObjects);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraPos` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Camera position {x, y, z} |
| `cameraPos.x` | `number` | - |
| `cameraPos.y` | `number` | - |
| `cameraPos.z` | `number` | - |
| `objects` | `GPURenderBundle`[] | Array of GPURenderBundle objects |

## Returns

`GPURenderBundle`[]


Sorted GPURenderBundle array
