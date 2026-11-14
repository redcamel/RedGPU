[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / sortTransparentObjects

# Function: sortTransparentObjects()

> **sortTransparentObjects**(`cameraPos`, `objects`): `GPURenderBundle`[]

Defined in: [src/math/sortTransparentObjects.ts:21](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/math/sortTransparentObjects.ts#L21)

Sorts an array of transparent render bundles (`GPURenderBundle`) in descending order (back-to-front) by squared distance from the camera position.

### Example
```typescript
const sortedBundles = RedGPU.Math.sortTransparentObjects(camera, transparentBundles);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraPos` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 3D world coordinates of the camera (`{ x: number, y: number, z: number }`) |
| `cameraPos.x` | `number` | - |
| `cameraPos.y` | `number` | - |
| `cameraPos.z` | `number` | - |
| `objects` | `GPURenderBundle`[] | `Array<GPURenderBundle>` to sort |

## Returns

`GPURenderBundle`[]

`Array<GPURenderBundle>` sorted in descending order of camera distance
