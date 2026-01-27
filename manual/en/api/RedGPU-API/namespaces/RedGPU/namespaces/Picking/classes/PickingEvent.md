[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/PickingEvent.ts:19](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L19)


Class encapsulating information related to mouse events.


Includes various properties such as mouse coordinates, event type, target mesh, providing useful information during event processing.
* ### Example
```typescript
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log(e.pickingId, e.target);
    console.log(e.localX, e.localY, e.localZ);
});
```

## Constructors

### Constructor

> **new PickingEvent**(`pickingId`, `mouseX`, `mouseY`, `target`, `time`, `type`, `nativeEvent`): `PickingEvent`

Defined in: [src/picking/PickingEvent.ts:125](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L125)


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

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:85](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L85)


Whether Alt key is pressed

#### Default Value

```ts
false
```

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:91](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L91)


Whether Ctrl key is pressed

#### Default Value

```ts
false
```

***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:67](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L67)


Local X coordinate

#### Default Value

```ts
0
```

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:73](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L73)


Local Y coordinate

#### Default Value

```ts
0
```

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:79](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L79)


Local Z coordinate

#### Default Value

```ts
0
```

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/PickingEvent.ts:29](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L29)


Mouse X coordinate

***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/PickingEvent.ts:34](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L34)


Mouse Y coordinate

***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:55](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L55)


Mouse X movement

#### Default Value

```ts
0
```

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:61](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L61)


Mouse Y movement

#### Default Value

```ts
0
```

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/PickingEvent.ts:24](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L24)


Picking ID

***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:97](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L97)


Whether Shift key is pressed

#### Default Value

```ts
false
```

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/PickingEvent.ts:39](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L39)


Event target mesh

***

### time

> **time**: `number`

Defined in: [src/picking/PickingEvent.ts:44](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L44)


Event occurrence time

***

### type

> **type**: `string`

Defined in: [src/picking/PickingEvent.ts:49](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/picking/PickingEvent.ts#L49)


Event type
