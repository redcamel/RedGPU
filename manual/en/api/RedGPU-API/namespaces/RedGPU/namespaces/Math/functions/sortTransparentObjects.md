[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/math/sortTransparentObjects.ts#L21)


Sorts transparent objects by distance from camera (descending).

### Example
```typescript
const sorted = RedGPU.math.sortTransparentObjects(camera.position, transparentObjects);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraPos` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Camera position {x, y, z} |
| `cameraPos.x` | `number` | - |
| `cameraPos.y` | `number` | - |
| `cameraPos.z` | `number` | - |
| `objects` | `GPURenderBundle`[] | Array of `GPURenderBundle` objects |

## Returns

`GPURenderBundle`[]


Sorted `GPURenderBundle` array
