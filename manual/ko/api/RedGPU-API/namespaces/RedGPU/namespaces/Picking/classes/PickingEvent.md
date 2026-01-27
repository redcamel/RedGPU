[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/PickingEvent.ts:19](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L19)

마우스 이벤트 관련 정보를 캡슐화한 클래스입니다.


마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함하며, 이벤트 처리 시 유용한 정보를 제공합니다.

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

Defined in: [src/picking/PickingEvent.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L125)

PickingEvent 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pickingId` | `number` | 피킹 ID
| `mouseX` | `number` | 마우스 X 좌표
| `mouseY` | `number` | 마우스 Y 좌표
| `target` | [`Mesh`](../../Display/classes/Mesh.md) | 이벤트 대상 메쉬
| `time` | `number` | 이벤트 발생 시간
| `type` | `string` | 이벤트 타입
| `nativeEvent` | `MouseEvent` | 네이티브 마우스 이벤트

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:85](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L85)

Alt 키 눌림 여부


#### Default Value

```ts
false
```

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:91](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L91)

Ctrl 키 눌림 여부


#### Default Value

```ts
false
```

***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:67](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L67)

로컬 X 좌표


#### Default Value

```ts
0
```

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:73](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L73)

로컬 Y 좌표


#### Default Value

```ts
0
```

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:79](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L79)

로컬 Z 좌표


#### Default Value

```ts
0
```

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/PickingEvent.ts:29](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L29)

마우스 X 좌표


***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/PickingEvent.ts:34](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L34)

마우스 Y 좌표


***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:55](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L55)

마우스 X 이동량


#### Default Value

```ts
0
```

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/PickingEvent.ts:61](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L61)

마우스 Y 이동량


#### Default Value

```ts
0
```

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/PickingEvent.ts:24](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L24)

피킹 ID


***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/PickingEvent.ts:97](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L97)

Shift 키 눌림 여부


#### Default Value

```ts
false
```

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/PickingEvent.ts:39](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L39)

이벤트 대상 메쉬


***

### time

> **time**: `number`

Defined in: [src/picking/PickingEvent.ts:44](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L44)

이벤트 발생 시간


***

### type

> **type**: `string`

Defined in: [src/picking/PickingEvent.ts:49](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/picking/PickingEvent.ts#L49)

이벤트 타입

