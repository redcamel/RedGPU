[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:37](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L37)

RedGPUContext 클래스는 WebGPU 초기화 후 제공되는 최상위 컨텍스트 객체입니다.


GPU, 캔버스, 디바이스, 어댑터 등 WebGPU의 핵심 정보를 속성으로 가집니다.

View3D 객체를 소유하며, 실제 최상위 컨테이너 역할을 합니다.

리사이즈, 배경색, 디버그 패널, 안티앨리어싱, 리소스 관리 등 다양한 기능을 제공합니다.


::: warning
이 클래스는 RedGPU.init()에 의해 내부적으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
RedGPU.init(canvas, (redGPUContext) => {
    console.log('Context created:', redGPUContext);
    redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
});
```

## Extends

- [`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md)

## Constructors

### Constructor

> **new RedGPUContext**(`htmlCanvas`, `gpuAdapter`, `gpuDevice`, `gpuContext`, `alphaMode`): `RedGPUContext`

Defined in: [src/context/RedGPUContext.ts:141](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L141)

RedGPUContext 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `htmlCanvas` | `HTMLCanvasElement` | 렌더링할 HTMLCanvasElement
| `gpuAdapter` | `GPUAdapter` | WebGPU Adapter
| `gpuDevice` | `GPUDevice` | WebGPU Device
| `gpuContext` | `GPUCanvasContext` | WebGPU Canvas Context
| `alphaMode` | `GPUCanvasAlphaMode` | 캔버스 알파 모드

#### Returns

`RedGPUContext`

#### Overrides

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`constructor`](../namespaces/Core/classes/RedGPUContextViewContainer.md#constructor)

## Properties

### currentRequestAnimationFrame

> **currentRequestAnimationFrame**: `number`

Defined in: [src/context/RedGPUContext.ts:42](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L42)

현재 requestAnimationFrame ID (프레임 루프 관리용)


***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:53](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L53)

현재 시간(프레임 기준, ms)


***

### onResize()

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:48](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L48)

리사이즈 이벤트 핸들러 (캔버스 크기 변경 시 호출)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `RedResizeEvent`\<`RedGPUContext`\> | 리사이즈 이벤트 객체

#### Returns

`void`

## Accessors

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:243](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L243)

캔버스의 알파 모드를 반환합니다.


##### Returns

`GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:254](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L254)

캔버스의 알파 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUCanvasAlphaMode` | 설정할 GPUCanvasAlphaMode 값

##### Returns

`void`

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/context/RedGPUContext.ts:169](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L169)

안티앨리어싱 매니저를 반환합니다.


##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:196](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L196)

배경색을 반환합니다.


##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:210](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L210)

배경색을 설정합니다.


##### Throws

value가 ColorRGBA 인스턴스가 아닐 경우 에러 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) | 설정할 ColorRGBA 객체

##### Returns

`void`

***

### boundingClientRect

#### Get Signature

> **get** **boundingClientRect**(): `DOMRect`

Defined in: [src/context/RedGPUContext.ts:161](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L161)

##### Returns

`DOMRect`

***

### configurationDescription

#### Get Signature

> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:227](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L227)

GPU 캔버스 구성 정보를 반환합니다.


##### Returns

`GPUCanvasConfiguration`

***

### detector

#### Get Signature

> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:219](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L219)

RedGPUContextDetector 인스턴스를 반환합니다.


##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:235](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L235)

GPU 어댑터를 반환합니다.


##### Returns

`GPUAdapter`

***

### gpuContext

#### Get Signature

> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:263](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L263)

GPU 캔버스 컨텍스트를 반환합니다.


##### Returns

`GPUCanvasContext`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:271](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L271)

GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:341](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L341)

높이를 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:352](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L352)

높이를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 높이 값 (숫자 또는 문자열)

##### Returns

`void`

***

### htmlCanvas

#### Get Signature

> **get** **htmlCanvas**(): `HTMLCanvasElement`

Defined in: [src/context/RedGPUContext.ts:279](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L279)

HTML 캔버스 요소를 반환합니다.


##### Returns

`HTMLCanvasElement`

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:287](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L287)

키보드 입력 버퍼를 반환합니다.


##### Returns

`object`

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:298](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L298)

키보드 입력 버퍼를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} | 키보드 상태 객체

##### Returns

`void`

***

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:47](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L47)

소유한 View3D 객체의 개수를 반환합니다.


##### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:368](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L368)

픽셀 단위 화면 크기 정보(Pixel)를 반환합니다. (물리 픽셀 단위)


##### Returns

`IRedGPURectObject`

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:376](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L376)

렌더 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:387](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L387)

렌더 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 렌더 스케일 값

##### Returns

`void`

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/context/RedGPUContext.ts:306](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L306)

리소스 매니저를 반환합니다.


##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:360](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L360)

화면 크기 정보(Screen)를 반환합니다. (CSS 픽셀 단위)


##### Returns

`IRedGPURectObject`

***

### sizeManager

#### Get Signature

> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:314](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L314)

RedGPUContextSizeManager 인스턴스를 반환합니다.


##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

***

### useDebugPanel

#### Get Signature

> **get** **useDebugPanel**(): `boolean`

Defined in: [src/context/RedGPUContext.ts:177](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L177)

디버그 패널 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDebugPanel**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:188](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L188)

디버그 패널 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:39](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L39)

이 인스턴스가 소유한 View3D 목록을 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:322](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L322)

너비를 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:333](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L333)

너비를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 너비 값 (숫자 또는 문자열)

##### Returns

`void`

## Methods

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:72](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L72)

뷰 리스트에 뷰를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 View3D 객체

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:87](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L87)

뷰 리스트의 지정된 인덱스에 뷰를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 View3D 객체
| `index` | `number` | 삽입할 인덱스

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:61](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L61)

주어진 자식 View3D가 현재 컨테이너에 포함되어 있는지 확인합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../Display/classes/View3D.md) | 확인할 자식 View3D

#### Returns

`boolean`

포함 여부


#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`contains`](../namespaces/Core/classes/RedGPUContextViewContainer.md#contains)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:399](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L399)

GPU 디바이스를 파기하고 리소스를 해제합니다.


#### Returns

`void`

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:103](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L103)

지정된 인덱스의 뷰를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 뷰의 인덱스

#### Returns

[`View3D`](../../Display/classes/View3D.md)

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:115](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L115)

지정된 뷰의 인덱스를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 검색할 View3D 객체

#### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:225](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L225)

뷰 리스트의 모든 뷰를 제거합니다.


#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:197](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L197)

뷰 리스트에서 지정된 뷰를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 제거할 View3D 객체

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L211)

뷰 리스트에서 지정된 인덱스의 뷰를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 뷰의 인덱스

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/RedGPUContext.ts:413](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/RedGPUContext.ts#L413)

컨텍스트의 크기를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | 너비 (기본값: 현재 width)
| `h` | `string` \| `number` | 높이 (기본값: 현재 height)

#### Returns

`void`

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:133](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L133)

지정된 뷰를 뷰 리스트의 특정 인덱스로 이동시킵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 이동할 View3D 객체
| `index` | `number` | 이동할 인덱스

#### Returns

`void`

#### Throws

뷰가 등록되지 않았거나 인덱스가 범위를 벗어난 경우 에러 발생


#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`setViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#setviewindex)

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:160](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L160)

뷰 리스트에서 두 뷰의 위치를 교환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../Display/classes/View3D.md) | 교환할 첫 번째 View3D
| `view2` | [`View3D`](../../Display/classes/View3D.md) | 교환할 두 번째 View3D

#### Returns

`void`

#### Throws

뷰가 이 컨텍스트의 자식이 아닐 경우 에러 발생


#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviews)

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:179](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextViewContainer.ts#L179)

지정된 인덱스에 있는 두 뷰의 위치를 교환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스
| `index2` | `number` | 두 번째 인덱스

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)
