[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:14](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L14)


Object defining picking event types.

### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-click"></a> `CLICK` | `"click"` | `'click'` | Mouse click (When a mouse up occurs on the same object after a mouse down) | [src/picking/PICKING\_EVENT\_TYPE.ts:44](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L44) |
| <a id="property-down"></a> `DOWN` | `"down"` | `'down'` | Mouse down (When a mouse button is pressed) | [src/picking/PICKING\_EVENT\_TYPE.ts:24](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L24) |
| <a id="property-move"></a> `MOVE` | `"move"` | `'move'` | Mouse move (When the mouse moves over the object) | [src/picking/PICKING\_EVENT\_TYPE.ts:19](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L19) |
| <a id="property-out"></a> `OUT` | `"out"` | `'out'` | Mouse out (When the mouse leaves the object area) | [src/picking/PICKING\_EVENT\_TYPE.ts:39](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L39) |
| <a id="property-over"></a> `OVER` | `"over"` | `'over'` | Mouse over (When the mouse enters the object area) | [src/picking/PICKING\_EVENT\_TYPE.ts:34](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L34) |
| <a id="property-up"></a> `UP` | `"up"` | `'up'` | Mouse up (When a mouse button is released) | [src/picking/PICKING\_EVENT\_TYPE.ts:29](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/PICKING_EVENT_TYPE.ts#L29) |
