[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/core/PickingEvent.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L24)

마우스 이벤트 관련 정보를 캡슐화한 클래스입니다.


마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함하며, 이벤트 처리 시 유용한 정보를 제공합니다.


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

Defined in: [src/picking/core/PickingEvent.ts:163](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L163)

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
| `hit?` | `RayIntersectResult` | 레이캐스팅 교차 결과 (선택적)

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:120](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L120)

Alt 키 눌림 여부


#### Default Value

```ts
false
```

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:126](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L126)

Ctrl 키 눌림 여부


#### Default Value

```ts
false
```

***

### distance

> **distance**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:76](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L76)

카메라와 교차 지점 사이의 거리


***

### faceIndex

> **faceIndex**: `number` = `-1`

Defined in: [src/picking/core/PickingEvent.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L114)

교차된 삼각형의 인덱스 (3D의 경우)


***

### localPoint

> **localPoint**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:81](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L81)

객체의 로컬 공간상의 교차 지점 좌표


***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L87)

로컬 X 좌표


#### Default Value

```ts
0
```

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L93)

로컬 Y 좌표


#### Default Value

```ts
0
```

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:99](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L99)

로컬 Z 좌표


#### Default Value

```ts
0
```

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/core/PickingEvent.ts:34](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L34)

마우스 X 좌표 (캔버스 기준)


***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/core/PickingEvent.ts:39](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L39)

마우스 Y 좌표 (캔버스 기준)


***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:60](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L60)

이전 이벤트 대비 마우스 X 이동량


#### Default Value

```ts
0
```

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:66](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L66)

이전 이벤트 대비 마우스 Y 이동량


#### Default Value

```ts
0
```

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/core/PickingEvent.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L29)

피킹 ID (색상 기반 피킹에 사용되는 고유 값)


***

### point

> **point**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:71](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L71)

월드 공간상의 교차 지점 좌표


***

### ray

> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/core/PickingEvent.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L109)

교차 검사에 사용된 월드 광선


***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:132](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L132)

Shift 키 눌림 여부


#### Default Value

```ts
false
```

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/core/PickingEvent.ts:44](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L44)

이벤트가 발생한 대상 메쉬


***

### time

> **time**: `number`

Defined in: [src/picking/core/PickingEvent.ts:49](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L49)

이벤트 발생 시간


***

### type

> **type**: `string`

Defined in: [src/picking/core/PickingEvent.ts:54](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L54)

이벤트 타입 (PICKING_EVENT_TYPE 참조)


***

### uv

> **uv**: [`vec2`](../../Math/type-aliases/vec2.md)

Defined in: [src/picking/core/PickingEvent.ts:104](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/picking/core/PickingEvent.ts#L104)

교차 지점의 UV 좌표 (텍스처 좌표)

