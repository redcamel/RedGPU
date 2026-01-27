[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/utils/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/sortTransparentObjects.ts#L21)


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
