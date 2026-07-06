[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABaseMaterial

# Abstract Class: ABaseMaterial

Defined in: [src/material/core/ABaseMaterial.ts:19](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L19)

다양한 머티리얼의 공통 기반이 되는 추상 클래스입니다.

셰이더 정보, 유니폼/텍스처/샘플러 구조, 블렌드 상태 등 렌더 파이프라인의 핵심 속성을 관리합니다.

머티리얼별로 GPU 파이프라인의 셰이더, 바인드 그룹, 블렌딩, 컬러/알파, 틴트, 투명도 등 다양한 렌더링 속성을 일관성 있게 제어할 수 있습니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md)

## Extended by

- [`ColorMaterial`](../../../classes/ColorMaterial.md)
- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Constructors

### Constructor

> `protected` **new ABaseMaterial**(`redGPUContext`, `moduleName`, `SHADER_INFO`, `targetGroupIndex`): `ABaseMaterial`

Defined in: [src/material/core/ABaseMaterial.ts:167](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L167)

ABaseMaterial 생성자

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `moduleName` | `string` | 머티리얼 모듈명
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보
| `targetGroupIndex` | `number` | 바인드 그룹 인덱스

#### Returns

`ABaseMaterial`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L69)

파이프라인 dirty 상태 플래그

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L64)

프래그먼트 GPU 렌더 정보 객체

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:35](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L35)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L24)

머티리얼의 불투명도(0~1)

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L29)

머티리얼의 틴트 컬러(RGBA)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L74)

머티리얼 투명도 여부

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L59)

2패스 렌더링 사용 여부

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L34)

틴트 컬러 사용 여부

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:295](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L295)

머티리얼의 알파 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:287](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L287)

머티리얼의 컬러 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L263)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.

##### Returns

`string`

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:255](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L255)

프래그먼트 셰이더 모듈명을 반환합니다.

##### Returns

`string`

***

### globalFragmentSlotIndex

#### Get Signature

> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:319](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L319)

##### Returns

`number`

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:247](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L247)

머티리얼 모듈명을 반환합니다.

##### Returns

`string`

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:271](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L271)

셰이더 storage 구조 정보를 반환합니다.

##### Returns

`any`

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:210](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L210)

틴트 블렌드 모드 이름을 반환합니다.

##### Returns

`string`

틴트 블렌드 모드 이름

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L225)

틴트 블렌드 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:279](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L279)

셰이더 uniforms 구조 정보를 반환합니다.

##### Returns

`any`

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:303](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L303)

머티리얼의 writeMask 상태 반환

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:314](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L314)

머티리얼의 writeMask 상태 설정

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant 값

##### Returns

`void`

## Methods

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L485)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.

#### Returns

`void`

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:373](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L373)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.

#### Returns

`void`

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:453](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L453)

GPU 프래그먼트 렌더 상태 객체를 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | 셰이더 엔트리포인트 (기본값: 'main')

#### Returns

`GPUFragmentState`

GPU 프래그먼트 상태

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L510)

샘플러 객체에서 GPU 샘플러를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

GPUSampler 인스턴스

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:327](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L327)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`instanceId`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L53)

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L61)

캐시 키를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#revision)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L89)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L101)

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L116)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)


</details>
