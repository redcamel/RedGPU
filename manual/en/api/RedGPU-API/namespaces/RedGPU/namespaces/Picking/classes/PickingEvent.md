[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/core/PickingEvent.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L26)

Event class containing mouse picking and raycasting intersection result information.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log(e.pickingId, e.target);
    console.log(e.localX, e.localY, e.localZ);
    console.log(e.distance, e.uv, e.localPoint);
});
```

## Constructors

### Constructor

> **new PickingEvent**(`pickingId`, `mouseX`, `mouseY`, `target`, `time`, `type`, `nativeEvent`, `hit?`): `PickingEvent`

Defined in: [src/picking/core/PickingEvent.ts:157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L157)

Creates a PickingEvent instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pickingId` | `number` | Picking ID |
| `mouseX` | `number` | Canvas-relative mouse X coordinate |
| `mouseY` | `number` | Canvas-relative mouse Y coordinate |
| `target` | [`Mesh`](../../Display/classes/Mesh.md) | Event target mesh |
| `time` | `number` | Event occurrence time (ms) |
| `type` | `string` | Picking event type |
| `nativeEvent` | `MouseEvent` | Native browser `MouseEvent` object |
| `hit?` | `RayIntersectResult` | Detailed raycasting intersection result (optional) |

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L116)

Whether the `Alt` key was pressed when the event occurred (default: `false`)

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L121)

Whether the `Ctrl` key was pressed when the event occurred (default: `false`)

***

### distance

> **distance**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L76)

Distance between the camera and the intersection point

***

### faceIndex

> **faceIndex**: `number` = `-1`

Defined in: [src/picking/core/PickingEvent.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L111)

Index of the intersected triangle face (default: `-1`)

***

### localPoint

> **localPoint**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L81)

Intersection point coordinates in the target object's local space

***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L86)

Local X coordinate of the intersection point (default: `0`)

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L91)

Local Y coordinate of the intersection point (default: `0`)

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L96)

Local Z coordinate of the intersection point (default: `0`)

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/core/PickingEvent.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L36)

Canvas-relative mouse X coordinate

***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/core/PickingEvent.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L41)

Canvas-relative mouse Y coordinate

***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L61)

Mouse X-axis movement relative to the previous event (default: `0`)

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L66)

Mouse Y-axis movement relative to the previous event (default: `0`)

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/core/PickingEvent.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L31)

Unique picking ID used for color-based picking

***

### point

> **point**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L71)

Intersection point coordinates in world space

***

### ray

> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/core/PickingEvent.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L106)

World `Ray` used for the intersection test

***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L126)

Whether the `Shift` key was pressed when the event occurred (default: `false`)

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/core/PickingEvent.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L46)

Target mesh where the event occurred

***

### time

> **time**: `number`

Defined in: [src/picking/core/PickingEvent.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L51)

Event occurrence time (ms)

***

### type

> **type**: `string`

Defined in: [src/picking/core/PickingEvent.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L56)

Picking event type (`PICKING_EVENT_TYPE`)

***

### uv

> **uv**: [`vec2`](../../Math/type-aliases/vec2.md)

Defined in: [src/picking/core/PickingEvent.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingEvent.ts#L101)

Texture UV coordinates at the intersection point
