[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewRenderTextureManager

# Class: ViewRenderTextureManager

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L88)

View3D/2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new ViewRenderTextureManager**(`view`): `ViewRenderTextureManager`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:119](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L119)

ViewRenderTextureManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 이 매니저가 관리할 View3D 인스턴스

#### Returns

`ViewRenderTextureManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### depthTexture

#### Get Signature

> **get** **depthTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:152](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L152)

깊이(depth) 텍스처를 반환합니다. (스왑 버퍼링 반영)

##### Returns

`GPUTexture`

***

### depthTexture0View

#### Get Signature

> **get** **depthTexture0View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:179](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L179)

첫 번째 깊이(depth) 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### depthTexture1View

#### Get Signature

> **get** **depthTexture1View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:188](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L188)

두 번째 깊이(depth) 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### depthTextureView

#### Get Signature

> **get** **depthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:161](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L161)

깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)

##### Returns

`GPUTextureView`

***

### gBuffers

#### Get Signature

> **get** **gBuffers**(): `Map`\<`string`, `GBufferInfo`\>

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:128](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L128)

G-Buffer 맵을 반환합니다.

##### Returns

`Map`\<`string`, `GBufferInfo`\>

***

### prevDepthTextureView

#### Get Signature

> **get** **prevDepthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:170](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L170)

이전 프레임의 깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)

##### Returns

`GPUTextureView`

***

### renderPath1ResultTexture

#### Get Signature

> **get** **renderPath1ResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:205](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L205)

렌더 패스 1단계 결과 텍스처를 반환합니다.

##### Returns

`GPUTexture`

***

### renderPath1ResultTextureDescriptor

#### Get Signature

> **get** **renderPath1ResultTextureDescriptor**(): `GPUTextureDescriptor`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:144](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L144)

렌더 패스 1단계 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.

##### Returns

`GPUTextureDescriptor`

***

### renderPath1ResultTextureView

#### Get Signature

> **get** **renderPath1ResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:197](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L197)

렌더 패스 1단계 결과 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:136](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L136)

현재 계산된 비디오 메모리 사용량 (바이트 단위)을 반환합니다.

##### Returns

`number`

## Methods

### getGBufferResolveTexture()

> **getGBufferResolveTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:231](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L231)

지정된 타입의 G-Buffer Resolve 텍스처를 반환합니다. (MSAA 해제 시 대상)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수

#### Returns

`GPUTexture`

***

### getGBufferResolveTextureView()

> **getGBufferResolveTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:255](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L255)

지정된 타입의 G-Buffer Resolve 텍스처 뷰를 반환합니다. (MSAA 해제 시 대상 뷰)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수

#### Returns

`GPUTextureView`

***

### getGBufferTexture()

> **getGBufferTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:219](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L219)

지정된 타입의 G-Buffer 텍스처를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수

#### Returns

`GPUTexture`

***

### getGBufferTextureView()

> **getGBufferTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:243](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L243)

지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수

#### Returns

`GPUTextureView`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

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

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
