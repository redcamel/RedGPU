[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L20)

Object defining mouse picking event type constants.

### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
// Register a click picking event listener
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-click"></a> `CLICK` | `"click"` | `'click'` | Event type triggered when a mouse up occurs on the same object after a mouse down (`'click'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L50) |
| <a id="property-down"></a> `DOWN` | `"down"` | `'down'` | Event type triggered when a mouse button is pressed over the object (`'down'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L30) |
| <a id="property-move"></a> `MOVE` | `"move"` | `'move'` | Event type triggered when the mouse moves over the object (`'move'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L25) |
| <a id="property-out"></a> `OUT` | `"out"` | `'out'` | Event type triggered when the mouse leaves the object area (`'out'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L45) |
| <a id="property-over"></a> `OVER` | `"over"` | `'over'` | Event type triggered when the mouse enters the object area (`'over'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L40) |
| <a id="property-up"></a> `UP` | `"up"` | `'up'` | Event type triggered when a mouse button is released over the object (`'up'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/PICKING_EVENT_TYPE.ts#L35) |

## See

 - [MouseEvent (Mesh) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/mesh/)
 - [MouseEvent (Raycasting) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
 - [MouseEvent (Sprite2D) example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)
