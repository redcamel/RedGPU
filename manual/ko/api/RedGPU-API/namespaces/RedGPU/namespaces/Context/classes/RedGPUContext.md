[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L40)

RedGPUContext 클래스는 WebGPU 초기화 후 제공되는 최상위 컨텍스트 객체입니다.

GPU, 캔버스, 디바이스, 어댑터 등 WebGPU의 핵심 정보를 속성으로 가집니다.
View3D 객체를 소유하며, 실제 최상위 컨테이너 역할을 합니다.
리사이즈, 배경색, 디버그 패널, 안티앨리어싱, 리소스 관리 등 다양한 기능을 제공합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

Defined in: [src/context/RedGPUContext.ts:164](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L164)

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

Defined in: [src/context/RedGPUContext.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L45)

현재 requestAnimationFrame ID (프레임 루프 관리용)

***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L56)

현재 시간(프레임 기준, ms)

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L51)

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

Defined in: [src/context/RedGPUContext.ts:286](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L286)

캔버스의 알파 모드를 반환합니다.

##### Returns

`GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:297](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L297)

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

Defined in: [src/context/RedGPUContext.ts:210](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L210)

안티앨리어싱 매니저를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:239](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L239)

배경색을 반환합니다.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:253](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L253)

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

Defined in: [src/context/RedGPUContext.ts:202](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L202)

HTML 캔버스의 BoundingClientRect 정보를 반환합니다.

##### Returns

`DOMRect`

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/context/RedGPUContext.ts:194](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L194)

커맨드 인코더 매니저를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

***

### configurationDescription

#### Get Signature

> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:270](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L270)

GPU 캔버스 구성 정보를 반환합니다.

##### Returns

`GPUCanvasConfiguration`

***

### detector

#### Get Signature

> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:262](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L262)

RedGPUContextDetector 인스턴스를 반환합니다.

##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

***

### globalFragmentSSBO\_BuiltIn

#### Get Signature

> **get** **globalFragmentSSBO\_BuiltIn**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:231](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L231)

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

***

### globalFragmentSSBO\_PBR

#### Get Signature

> **get** **globalFragmentSSBO\_PBR**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:226](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L226)

글로벌 SSAO 프래그먼트 버퍼 매니저를 반환합니다.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

***

### globalVertexSSBO

#### Get Signature

> **get** **globalVertexSSBO**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:218](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L218)

글로벌 SSAO 버텍스 버퍼 매니저를 반환합니다.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:278](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L278)

GPU 어댑터를 반환합니다.

##### Returns

`GPUAdapter`

***

### gpuContext

#### Get Signature

> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:306](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L306)

GPU 캔버스 컨텍스트를 반환합니다.

##### Returns

`GPUCanvasContext`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:314](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L314)

GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:384](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L384)

높이를 반환합니다.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:395](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L395)

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

Defined in: [src/context/RedGPUContext.ts:322](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L322)

HTML 캔버스 요소를 반환합니다.

##### Returns

`HTMLCanvasElement`

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:330](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L330)

키보드 입력 상태 버퍼를 반환합니다.

##### Returns

`object`

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:341](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L341)

키보드 입력 상태 버퍼를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} | 키보드 상태 객체

##### Returns

`void`

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:411](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L411)

픽셀 단위 화면 크기 정보(Pixel)를 반환합니다. (물리 픽셀 단위)

##### Returns

`IRedGPURectObject`

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:419](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L419)

렌더 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:430](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L430)

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

Defined in: [src/context/RedGPUContext.ts:349](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L349)

리소스 매니저를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:403](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L403)

화면 크기 정보(Screen)를 반환합니다. (CSS 픽셀 단위)

##### Returns

`IRedGPURectObject`

***

### sizeManager

#### Get Signature

> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:357](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L357)

RedGPUContextSizeManager 인스턴스를 반환합니다.

##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:365](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L365)

너비를 반환합니다.

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:376](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L376)

너비를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 너비 값 (숫자 또는 문자열)

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:442](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L442)

GPU 디바이스를 파기하고 리소스를 해제합니다.

#### Returns

`void`

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/RedGPUContext.ts:460](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/RedGPUContext.ts#L460)

컨텍스트의 크기를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | 너비 (기본값: 현재 width)
| `h` | `string` \| `number` | 높이 (기본값: 현재 height)

#### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### numViews

#### Get Signature

> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L52)

소유한 View3D 객체의 개수를 반환합니다.

##### Returns

`number`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

### viewList

#### Get Signature

> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L44)

이 인스턴스가 소유한 View3D 목록을 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L80)

뷰 리스트에 뷰를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 View3D 객체

#### Returns

`void`

#### Throws

view가 View3D 인스턴스가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:98](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L98)

뷰 리스트의 지정된 인덱스에 뷰를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 View3D 객체
| `index` | `number` | 삽입할 인덱스

#### Returns

`void`

#### Throws

view가 View3D 인스턴스가 아니거나 index가 올바른 uint 범위가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:66](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L66)

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

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:120](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L120)

지정된 인덱스의 뷰를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 뷰의 인덱스

#### Returns

[`View3D`](../../Display/classes/View3D.md)

해당 인덱스의 View3D 객체

#### Throws

index가 올바른 uint 범위가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:138](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L138)

지정된 뷰의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 검색할 View3D 객체

#### Returns

`number`

뷰의 인덱스 (찾지 못하면 -1)

#### Throws

view가 View3D 인스턴스가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:257](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L257)

뷰 리스트의 모든 뷰를 제거합니다.

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:226](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L226)

뷰 리스트에서 지정된 뷰를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 제거할 View3D 객체

#### Returns

`void`

#### Throws

뷰가 등록되어 있지 않은 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:243](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L243)

뷰 리스트에서 지정된 인덱스의 뷰를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 뷰의 인덱스

#### Returns

`void`

#### Throws

인덱스가 범위를 벗어난 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:156](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L156)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L183)

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

Defined in: [src/context/core/RedGPUContextViewContainer.ts:205](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/context/core/RedGPUContextViewContainer.ts#L205)

지정된 인덱스에 있는 두 뷰의 위치를 교환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스
| `index2` | `number` | 두 번째 인덱스

#### Returns

`void`

#### Throws

인덱스가 범위를 벗어나거나 두 인덱스가 같은 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)


</details>
