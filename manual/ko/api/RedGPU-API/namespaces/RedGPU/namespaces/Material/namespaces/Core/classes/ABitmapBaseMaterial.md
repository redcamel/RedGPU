[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABitmapBaseMaterial

# Abstract Class: ABitmapBaseMaterial

Defined in: [src/material/core/ABitmapBaseMaterial.ts:17](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L17)

비트맵/큐브/노이즈 텍스처 기반 머티리얼의 공통 속성 및 기능을 제공하는 추상 클래스입니다.


텍스처/샘플러의 변경 감지 및 파이프라인 갱신, 텍스처 리스너 관리 등 텍스처 기반 머티리얼의 핵심 로직을 구현합니다.


## Extends

- [`ABaseMaterial`](ABaseMaterial.md)

## Extended by

- [`PBRMaterial`](../../../classes/PBRMaterial.md)
- [`SkyBoxMaterial`](../../../../Display/namespaces/CoreSkyBox/classes/SkyBoxMaterial.md)
- [`TextFieldMaterial`](../../../../Display/namespaces/CoreTextField/classes/TextFieldMaterial.md)
- [`AUVTransformBaseMaterial`](AUVTransformBaseMaterial.md)

## Constructors

### Constructor

> **new ABitmapBaseMaterial**(`redGPUContext`, `moduleName`, `SHADER_INFO`, `targetGroupIndex`): `ABitmapBaseMaterial`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:40](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L40)

ABitmapBaseMaterial 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `moduleName` | `string` | 머티리얼 모듈명
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보
| `targetGroupIndex` | `number` | 바인드 그룹 인덱스

#### Returns

`ABitmapBaseMaterial`

#### Overrides

[`ABaseMaterial`](ABaseMaterial.md).[`constructor`](ABaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L22)

파이프라인 갱신 시 호출되는 콜백 리스트


***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L62)

파이프라인 dirty 상태 플래그


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`dirtyPipeline`](ABaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L57)

프래그먼트 GPU 렌더 정보 객체


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`gpuRenderInfo`](ABaseMaterial.md#gpurenderinfo)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L23)

머티리얼의 불투명도(0~1)


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`opacity`](ABaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L28)

머티리얼의 틴트 컬러(RGBA)


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`tint`](ABaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L67)

머티리얼 투명도 여부


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`transparent`](ABaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L52)

2패스 렌더링 사용 여부


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`use2PathRender`](ABaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L33)

틴트 컬러 사용 여부


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`useTint`](ABaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L289)

머티리얼의 알파 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`blendAlphaState`](ABaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L281)

머티리얼의 컬러 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`blendColorState`](ABaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L65)

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`cacheKey`](ABaseMaterial.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L257)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](ABaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L249)

프래그먼트 셰이더 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](ABaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`gpuDevice`](ABaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L241)

머티리얼 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`MODULE_NAME`](ABaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`name`](ABaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`redGPUContext`](ABaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`resourceManagerKey`](ABaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L265)

셰이더 storage 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`STORAGE_STRUCT`](ABaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L205)

틴트 블렌드 모드 이름을 반환합니다.


##### Returns

`string`

틴트 블렌드 모드 이름


#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L220)

틴트 블렌드 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`tintBlendMode`](ABaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L273)

셰이더 uniforms 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`UNIFORM_STRUCT`](ABaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`uuid`](ABaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L297)

머티리얼의 writeMask 상태 반환


##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L308)

머티리얼의 writeMask 상태 설정


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant 값

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`writeMaskState`](ABaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`__addDirtyPipelineListener`](ABaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`__fireListenerList`](ABaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`__removeDirtyPipelineListener`](ABaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L463)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`_updateBaseProperty`](ABaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L351)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`_updateFragmentState`](ABaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L431)

GPU 프래그먼트 렌더 상태 객체를 반환합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | 셰이더 엔트리포인트 (기본값: 'main')

#### Returns

`GPUFragmentState`

GPU 프래그먼트 상태


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`getFragmentRenderState`](ABaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L488)

샘플러 객체에서 GPU 샘플러를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

GPUSampler 인스턴스


#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`getGPUResourceSampler`](ABaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L316)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`initGPURenderInfos`](ABaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L75)

샘플러 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 이전 샘플러
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 새 샘플러

#### Returns

`void`

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L59)

텍스처 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | 이전 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)
| `texture` | [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | 새 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)

#### Returns

`void`
