[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:56](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L56)

캔버스 크기 및 렌더링 스케일을 관리하는 클래스입니다.


픽셀(px) 또는 백분율(%) 단위로 크기를 설정할 수 있으며, 렌더링 해상도 조절 기능을 제공합니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
const sizeManager = redGPUContext.sizeManager;
sizeManager.renderScale = 0.5; // Reduce resolution to 50%
sizeManager.setSize('100%', '100%');
```

## Constructors

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width`, `height`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:77](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L77)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:130](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L130)

설정된 높이 값을 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:141](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L141)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:170](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L170)

캔버스의 부모 DOM 요소의 크기 정보를 반환합니다.


##### Returns

`DOMRect`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:149](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L149)

현재 렌더링될 실제 픽셀 단위 Rect를 배열로 반환합니다. [x, y, w, h]


##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:157](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L157)

현재 렌더링될 실제 픽셀 단위 Rect를 객체로 반환합니다.


##### Returns

`IRedGPURectObject`

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:89](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L89)

렌더링 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:100](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L100)

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

> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:174](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L174)

##### Returns

`IRedGPURectObject`

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:111](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L111)

설정된 너비 값을 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:122](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L122)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:280](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L280)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:257](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L257)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:240](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L240)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:211](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L211)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:190](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/context/core/RedGPUContextSizeManager.ts#L190)

입력값이 유효한 사이즈 값인지 검증합니다. (양수, px, %)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 값

#### Returns

`void`
