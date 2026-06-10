[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:85](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L85)

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

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width?`, `height?`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:125](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L125)

RedGPUContextSizeManager 생성자

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `string` \| `number` | `'100%'` | 초기 너비 (기본값: '100%')
| `height` | `string` \| `number` | `'100%'` | 초기 높이 (기본값: '100%')

#### Returns

`RedGPUContextSizeManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:180](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L180)

설정된 높이 값을 반환합니다.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:191](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L191)

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

> **get** **parentDomRect**(): `ParentRect`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:220](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L220)

캔버스의 부모 DOM 요소의 크기 정보를 반환합니다.

##### Returns

`ParentRect`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:199](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L199)

현재 렌더링될 실제 픽셀 단위 Rect를 배열로 반환합니다. [x, y, w, h]

##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:207](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L207)

현재 렌더링될 실제 픽셀 단위 Rect를 객체로 반환합니다.

##### Returns

`IRedGPURectObject`

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:139](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L139)

렌더링 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:150](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L150)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:249](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L249)

CSS 픽셀 단위 화면 크기 정보를 반환합니다.

##### Returns

`IRedGPURectObject`

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:161](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L161)

설정된 너비 값을 반환합니다.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:172](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L172)

너비를 설정합니다. (px, % 또는 숫자)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 너비 값

##### Returns

`void`

## Methods

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:355](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L355)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:332](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L332)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:315](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L315)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:286](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L286)

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

Defined in: [src/context/core/RedGPUContextSizeManager.ts:265](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/context/core/RedGPUContextSizeManager.ts#L265)

입력값이 유효한 사이즈 값인지 검증합니다. (양수, px, %)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 값

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
