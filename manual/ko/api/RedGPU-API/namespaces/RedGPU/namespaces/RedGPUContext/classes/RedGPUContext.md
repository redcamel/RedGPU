[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RedGPUContext](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L24)

RedGPUContext 클래스는 WebGPU 초기화 후 제공되는 최상위 컨텍스트 객체입니다.


GPU, 캔버스, 디바이스, 어댑터 등 WebGPU의 핵심 정보를 속성으로 가집니다.

View3D 객체를 소유하며, 실제 최상위 컨테이너 역할을 합니다.

리사이즈, 배경색, 디버그 패널, 안티앨리어싱, 리소스 관리 등 다양한 기능을 제공합니다.


## Extends

- [`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md)

## Constructors

### Constructor

> **new RedGPUContext**(`htmlCanvas`, `gpuAdapter`, `gpuDevice`, `gpuContext`, `alphaMode`): `RedGPUContext`

Defined in: [src/context/RedGPUContext.ts:127](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L127)

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

Defined in: [src/context/RedGPUContext.ts:29](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L29)

현재 requestAnimationFrame ID (프레임 루프 관리용)


***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:39](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L39)

현재 시간(프레임 기준, ms)


***

### onResize()

> **onResize**: (`width`, `height`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:34](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L34)

리사이즈 이벤트 핸들러 (캔버스 크기 변경 시 호출)


#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

## Accessors

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:229](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L229)

캔버스의 알파 모드를 반환합니다.


##### Returns

`GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:240](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L240)

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

Defined in: [src/context/RedGPUContext.ts:155](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L155)

안티앨리어싱 매니저를 반환합니다.


##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:182](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L182)

배경색을 반환합니다.


##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:196](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L196)

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

Defined in: [src/context/RedGPUContext.ts:147](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L147)

##### Returns

`DOMRect`

***

### configurationDescription

#### Get Signature

> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:213](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L213)

GPU 캔버스 구성 정보를 반환합니다.


##### Returns

`GPUCanvasConfiguration`

***

### detector

#### Get Signature

> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:205](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L205)

RedGPUContextDetector 인스턴스를 반환합니다.


##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:221](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L221)

GPU 어댑터를 반환합니다.


##### Returns

`GPUAdapter`

***

### gpuContext

#### Get Signature

> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:249](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L249)

GPU 캔버스 컨텍스트를 반환합니다.


##### Returns

`GPUCanvasContext`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:257](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L257)

GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:327](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L327)

높이를 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:338](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L338)

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

Defined in: [src/context/RedGPUContext.ts:265](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L265)

HTML 캔버스 요소를 반환합니다.


##### Returns

`HTMLCanvasElement`

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:273](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L273)

키보드 입력 버퍼를 반환합니다.


##### Returns

`object`

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:284](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L284)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:39](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L39)

소유한 View3D 객체의 개수를 반환합니다.


##### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:350](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L350)

렌더 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:361](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L361)

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

Defined in: [src/context/RedGPUContext.ts:292](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L292)

리소스 매니저를 반환합니다.


##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/context/RedGPUContext.ts:342](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L342)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/context/core/RedGPUContextSizeManager.ts:145](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L145) |
| `width` | `number` | [src/context/core/RedGPUContextSizeManager.ts:144](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L144) |
| `x` | `number` | [src/context/core/RedGPUContextSizeManager.ts:142](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L142) |
| `y` | `number` | [src/context/core/RedGPUContextSizeManager.ts:143](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextSizeManager.ts#L143) |

***

### sizeManager

#### Get Signature

> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:300](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L300)

RedGPUContextSizeManager 인스턴스를 반환합니다.


##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

***

### useDebugPanel

#### Get Signature

> **get** **useDebugPanel**(): `boolean`

Defined in: [src/context/RedGPUContext.ts:163](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L163)

디버그 패널 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDebugPanel**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:174](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L174)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:31](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L31)

이 인스턴스가 소유한 View3D 목록을 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:308](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L308)

너비를 반환합니다.


##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:319](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L319)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:64](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L64)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:79](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L79)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:53](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L53)

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

Defined in: [src/context/RedGPUContext.ts:373](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L373)

GPU 디바이스를 파기하고 리소스를 해제합니다.


#### Returns

`void`

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:95](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L95)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:107](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L107)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:217](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L217)

뷰 리스트의 모든 뷰를 제거합니다.


#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:189](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L189)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:203](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L203)

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

> **setSize**(`w`, `h`): `void`

Defined in: [src/context/RedGPUContext.ts:387](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/RedGPUContext.ts#L387)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:125](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L125)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:152](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L152)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:171](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/context/core/RedGPUContextViewContainer.ts#L171)

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
