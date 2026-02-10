[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / screenToWorld

# Function: screenToWorld()

> **screenToWorld**(`screenX`, `screenY`, `view`): `number`[]

Defined in: [src/math/coordinates/screenToWorld.ts:36](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/math/coordinates/screenToWorld.ts#L36)


Converts 2D screen pixel coordinates to 3D world coordinates.


Calculates a position in 3D space based on View3D's camera and projection.

### Example
```typescript
const worldPos = RedGPU.math.screenToWorld(mouseX, mouseY, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate (pixels) |
| `screenY` | `number` | Screen Y coordinate (pixels) |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | AView instance to use for conversion |

## Returns

`number`[]


Converted 3D world coordinates [x, y, z]
