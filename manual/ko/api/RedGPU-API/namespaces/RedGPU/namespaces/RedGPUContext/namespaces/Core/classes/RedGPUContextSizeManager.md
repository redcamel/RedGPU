[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [RedGPUContext](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:22](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L22)

캔버스 크기 및 렌더링 스케일을 관리하는 클래스입니다.


픽셀(px) 또는 백분율(%) 단위로 크기를 설정할 수 있으며, 렌더링 해상도 조절 기능을 제공합니다.


## Constructors

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width`, `height`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:43](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L43)

RedGPUContextSizeManager 생성자


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `string` \| `number` | `'100%'` | 초기 너비 (기본값: '100%')
| `height` | `string` \| `number` | `'100%'` | 초기 높이 (기본값: '100%')

#### Returns

`RedGPUContextSizeManager`

## Accessors

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:96](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L96)

설정된 높이 값을 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:107](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L107)

높이를 설정합니다. (px, % 또는 숫자)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 높이 값

##### Returns

`void`

***

### parentDomRect

#### Get Signature

> **get** **parentDomRect**(): `DOMRect`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:136](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L136)

캔버스의 부모 DOM 요소의 크기 정보를 반환합니다.


##### Returns

`DOMRect`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:115](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L115)

현재 렌더링될 실제 픽셀 단위 Rect를 배열로 반환합니다. [x, y, w, h]


##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:123](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L123)

현재 렌더링될 실제 픽셀 단위 Rect를 객체로 반환합니다.


##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:128](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L128) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:127](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L127) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:125](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L125) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:126](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L126) |

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:55](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L55)

렌더링 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:66](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L66)

렌더링 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 렌더 스케일 값 (0.01 이상)

##### Returns

`void`

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:140](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L140)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:145](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L145) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:144](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L144) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:142](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L142) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:143](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L143) |

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:77](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L77)

설정된 너비 값을 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:88](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L88)

너비를 설정합니다. (px, % 또는 숫자)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 너비 값

##### Returns

`void`

## Methods

### setSize()

> **setSize**(`w`, `h`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:246](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L246)

요소의 크기를 설정하고 캔버스 스타일을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | 너비 (기본값: 현재 width)
| `h` | `string` \| `number` | 높이 (기본값: 현재 height)

#### Returns

`void`

***

### calculateSizeFromString()

> `static` **calculateSizeFromString**(`rect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:223](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L223)

문자열 값(px, %)을 픽셀 단위 숫자로 변환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | 참조 Rect 객체
| `rect.height` | `number` | - |
| `rect.width` | `number` | - |
| `rect.x` | `number` | - |
| `rect.y` | `number` | - |
| `key` | `string` | 참조할 키
| `value` | `string` | 변환할 문자열 값

#### Returns

`number`

***

### getPixelDimension()

> `static` **getPixelDimension**(`parentRect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:206](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L206)

부모 Rect를 기준으로 픽셀 크기를 계산하여 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentRect` | `ParentRect` | 부모 Rect
| `key` | `string` | 참조할 키 (width 또는 height)
| `value` | `string` \| `number` | 값 (숫자 또는 문자열)

#### Returns

`number`

***

### validatePositionValue()

> `static` **validatePositionValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:177](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L177)

입력값이 유효한 위치 값인지 검증합니다. (숫자, px, %)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 값

#### Returns

`void`

***

### validateSizeValue()

> `static` **validateSizeValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:156](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextSizeManager.ts#L156)

입력값이 유효한 사이즈 값인지 검증합니다. (양수, px, %)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 값

#### Returns

`void`
