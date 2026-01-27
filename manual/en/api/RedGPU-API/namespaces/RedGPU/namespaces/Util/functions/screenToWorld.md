[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / screenToWorld

# Function: screenToWorld()

> **screenToWorld**(`screenX`, `screenY`, `view`): `number`[]

Defined in: [src/utils/math/coordinates/screenToWorld.ts:36](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/utils/math/coordinates/screenToWorld.ts#L36)


Converts 2D screen pixel coordinates to 3D world coordinates.


Calculates a position in 3D space based on View3D's camera and projection.

* ### Example
```typescript
const worldPos = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
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
