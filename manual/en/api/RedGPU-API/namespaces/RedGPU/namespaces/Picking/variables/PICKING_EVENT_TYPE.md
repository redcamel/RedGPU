[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:13](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L13)


Object defining picking event types.
* ### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="click"></a> `CLICK` | `"click"` | `'click'` | Mouse click | [src/picking/PICKING\_EVENT\_TYPE.ts:43](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L43) |
| <a id="down"></a> `DOWN` | `"down"` | `'down'` | Mouse down | [src/picking/PICKING\_EVENT\_TYPE.ts:23](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L23) |
| <a id="move"></a> `MOVE` | `"move"` | `'move'` | Mouse move | [src/picking/PICKING\_EVENT\_TYPE.ts:18](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L18) |
| <a id="out"></a> `OUT` | `"out"` | `'out'` | Mouse out | [src/picking/PICKING\_EVENT\_TYPE.ts:38](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L38) |
| <a id="over"></a> `OVER` | `"over"` | `'over'` | Mouse over | [src/picking/PICKING\_EVENT\_TYPE.ts:33](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L33) |
| <a id="up"></a> `UP` | `"up"` | `'up'` | Mouse up | [src/picking/PICKING\_EVENT\_TYPE.ts:28](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/picking/PICKING_EVENT_TYPE.ts#L28) |
