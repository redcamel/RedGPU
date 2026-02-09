[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/core/PickingEvent.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L24)


Class encapsulating information related to mouse events.


Includes various properties such as mouse coordinates, event type, target mesh, providing useful information during event processing.

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

Defined in: [src/picking/core/PickingEvent.ts:163](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L163)


Creates a PickingEvent instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pickingId` | `number` | Picking ID |
| `mouseX` | `number` | Mouse X coordinate |
| `mouseY` | `number` | Mouse Y coordinate |
| `target` | [`Mesh`](../../Display/classes/Mesh.md) | Event target mesh |
| `time` | `number` | Event occurrence time |
| `type` | `string` | Event type |
| `nativeEvent` | `MouseEvent` | Native mouse event |
| `hit?` | `RayIntersectResult` | Raycasting intersection result (optional) |

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:120](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L120)


Whether the Alt key is pressed

#### Default Value

```ts
false
```

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:126](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L126)


Whether the Ctrl key is pressed

#### Default Value

```ts
false
```

***

### distance

> **distance**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:76](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L76)


Distance between the camera and the intersection point

***

### faceIndex

> **faceIndex**: `number` = `-1`

Defined in: [src/picking/core/PickingEvent.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L114)


Index of the intersected triangle (For 3D)

***

### localPoint

> **localPoint**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L81)


Intersection point coordinates in the object's local space

***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:87](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L87)


Local X coordinate

#### Default Value

```ts
0
```

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L93)


Local Y coordinate

#### Default Value

```ts
0
```

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:99](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L99)


Local Z coordinate

#### Default Value

```ts
0
```

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/core/PickingEvent.ts:34](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L34)


Mouse X coordinate (Canvas relative)

***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/core/PickingEvent.ts:39](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L39)


Mouse Y coordinate (Canvas relative)

***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L60)


Mouse X movement compared to the previous event

#### Default Value

```ts
0
```

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:66](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L66)


Mouse Y movement compared to the previous event

#### Default Value

```ts
0
```

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/core/PickingEvent.ts:29](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L29)


Picking ID (Unique value used for color-based picking)

***

### point

> **point**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:71](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L71)


Intersection point coordinates in world space

***

### ray

> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/core/PickingEvent.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L109)


World ray used for intersection test

***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:132](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L132)


Whether the Shift key is pressed

#### Default Value

```ts
false
```

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/core/PickingEvent.ts:44](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L44)


The target mesh where the event occurred

***

### time

> **time**: `number`

Defined in: [src/picking/core/PickingEvent.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L49)


Event occurrence time

***

### type

> **type**: `string`

Defined in: [src/picking/core/PickingEvent.ts:54](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L54)


Event type (See PICKING_EVENT_TYPE)

***

### uv

> **uv**: [`vec2`](../../Math/type-aliases/vec2.md)

Defined in: [src/picking/core/PickingEvent.ts:104](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/core/PickingEvent.ts#L104)


UV coordinates at the intersection point (Texture coordinates)
