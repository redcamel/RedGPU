[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingEvent

# Class: PickingEvent

Defined in: [src/picking/core/PickingEvent.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L26)

마우스 피킹 및 레이캐스팅 교차 결과 정보를 담는 이벤트 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

Defined in: [src/picking/core/PickingEvent.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L157)

PickingEvent 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pickingId` | `number` | 피킹 ID |
| `mouseX` | `number` | 캔버스 기준 마우스 X 좌표 |
| `mouseY` | `number` | 캔버스 기준 마우스 Y 좌표 |
| `target` | [`Mesh`](../../Display/classes/Mesh.md) | 이벤트 대상 메시 |
| `time` | `number` | 이벤트 발생 시각 (ms) |
| `type` | `string` | 피킹 이벤트 타입 |
| `nativeEvent` | `MouseEvent` | 원본 브라우저 `MouseEvent` 객체 |
| `hit?` | `RayIntersectResult` | 레이캐스팅 교차 상세 결과 (선택) |

#### Returns

`PickingEvent`

## Properties

### altKey

> **altKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L116)

이벤트 발생 시 `Alt` 키 눌림 여부 (기본값: `false`)

***

### ctrlKey

> **ctrlKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L121)

이벤트 발생 시 `Ctrl` 키 눌림 여부 (기본값: `false`)

***

### distance

> **distance**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L76)

카메라와 교차 지점 사이의 거리

***

### faceIndex

> **faceIndex**: `number` = `-1`

Defined in: [src/picking/core/PickingEvent.ts:111](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L111)

교차된 삼각형 면의 인덱스 (기본값: `-1`)

***

### localPoint

> **localPoint**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L81)

대상 객체 로컬 공간상의 교차 지점 좌표

***

### localX

> **localX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L86)

로컬 교차 지점의 X 좌표 (기본값: `0`)

***

### localY

> **localY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L91)

로컬 교차 지점의 Y 좌표 (기본값: `0`)

***

### localZ

> **localZ**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L96)

로컬 교차 지점의 Z 좌표 (기본값: `0`)

***

### mouseX

> **mouseX**: `number`

Defined in: [src/picking/core/PickingEvent.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L36)

캔버스 기준 마우스 X 좌표

***

### mouseY

> **mouseY**: `number`

Defined in: [src/picking/core/PickingEvent.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L41)

캔버스 기준 마우스 Y 좌표

***

### movementX

> **movementX**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L61)

이전 이벤트 대비 마우스 X축 이동량 (기본값: `0`)

***

### movementY

> **movementY**: `number` = `0`

Defined in: [src/picking/core/PickingEvent.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L66)

이전 이벤트 대비 마우스 Y축 이동량 (기본값: `0`)

***

### pickingId

> **pickingId**: `number`

Defined in: [src/picking/core/PickingEvent.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L31)

색상 기반 피킹에 사용되는 고유 피킹 ID

***

### point

> **point**: [`vec3`](../../Math/type-aliases/vec3.md)

Defined in: [src/picking/core/PickingEvent.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L71)

월드 공간상의 교차 지점 좌표

***

### ray

> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/core/PickingEvent.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L106)

교차 검사에 사용된 월드 광선(`Ray`)

***

### shiftKey

> **shiftKey**: `boolean` = `false`

Defined in: [src/picking/core/PickingEvent.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L126)

이벤트 발생 시 `Shift` 키 눌림 여부 (기본값: `false`)

***

### target

> **target**: [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/picking/core/PickingEvent.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L46)

이벤트가 발생한 대상 메시

***

### time

> **time**: `number`

Defined in: [src/picking/core/PickingEvent.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L51)

이벤트 발생 시각 (ms)

***

### type

> **type**: `string`

Defined in: [src/picking/core/PickingEvent.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L56)

피킹 이벤트 타입 (`PICKING_EVENT_TYPE`)

***

### uv

> **uv**: [`vec2`](../../Math/type-aliases/vec2.md)

Defined in: [src/picking/core/PickingEvent.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/core/PickingEvent.ts#L101)

교차 지점의 텍스처 UV 좌표
