[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / screenToWorld

# Function: screenToWorld()

> **screenToWorld**(`screenX`, `screenY`, `view`): `number`[]

Defined in: [src/math/coordinates/screenToWorld.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/coordinates/screenToWorld.ts#L34)

Converts 2D screen pixel coordinates (`screenX`, `screenY`) into 3D world coordinates (`[x, y, z]`) using the inverse view-projection matrix of the view (`AView`).

### Example
```typescript
const [worldX, worldY, worldZ] = RedGPU.Math.screenToWorld(mouseX, mouseY, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate (in CSS pixels) |
| `screenY` | `number` | Screen Y coordinate (in CSS pixels) |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | Target `AView` instance for transformation |

## Returns

`number`[]

Transformed 3D world coordinate array (`[x, y, z]`)

## See

[Screen to World example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/screenToWorld/)
