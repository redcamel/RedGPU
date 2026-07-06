[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyBox](../README.md) / SkyBoxMaterial

# Class: SkyBoxMaterial

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:17](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L17)

SkyBox 렌더링에 특화된 전용 셰이더 및 바인딩 처리를 제공하는 머티리얼 클래스입니다.

## Extends

- [`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new SkyBoxMaterial**(`redGPUContext`, `texture`): `SkyBoxMaterial`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:87](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L87)

SkyBoxMaterial 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `texture` | [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) | 초기 큐브 텍스처 객체

#### Returns

`SkyBoxMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties

### averageLuminance

> **averageLuminance**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L57)

분석 완료된 HDR 텍스처의 평균 휘도

***

### blur

> **blur**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L42)

스카이박스 이미지의 블러 가우시안 필터 강도 (0.0 ~ 1.0)

***

### intensityMultiplier

> **intensityMultiplier**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:47](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L47)

아티스트 시각 제어용 최종 라이팅 밝기 강도 배율

***

### luminance

> **luminance**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L52)

물리 기반 광학 시뮬레이션용 휘도값 (Nit, 기본값: 10000 Nit)

***

### sampler0

> **sampler0**: [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L37)

스카이박스 텍스처 샘플링 필터링 설정을 제어하는 Sampler 인스턴스

***

### texture0

> **texture0**: [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L22)

스카이박스 렌더링에 적용할 현재 큐브 텍스처

***

### transitionMask

> **transitionMask**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L32)

전환 애니메이션에 적용할 지형/노이즈 마스크 텍스처

***

### transitionProgress

> **transitionProgress**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L67)

두 텍스처 간의 보간 전환 진행률 (0.0 ~ 1.0)

***

### transitionTexture

> **transitionTexture**: [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L27)

부드러운 전환 효과 진행 시 대상이 되는 목표 큐브 텍스처

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABitmapBaseMaterial.ts#L27)

파이프라인 갱신 시 호출되는 콜백 리스트

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L69)

파이프라인 dirty 상태 플래그

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../../../../Material/namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L64)

프래그먼트 GPU 렌더 정보 객체

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`instanceId`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#instanceid)

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:35](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L35)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`isInstanceofMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#isinstanceofmaterial)

***

### opacity

> **opacity**: `number`

Defined in: [src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyboxs/skyBox/core/SkyBoxMaterial.ts#L62)

스카이박스의 불투명도 수치 (0.0 ~ 1.0)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L29)

머티리얼의 틴트 컬러(RGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L74)

머티리얼 투명도 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L59)

2패스 렌더링 사용 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L34)

틴트 컬러 사용 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`antialiasingManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#antialiasingmanager)

***

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:295](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L295)

머티리얼의 알파 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:287](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L287)

머티리얼의 컬러 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`cacheKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#cachekey)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`commandEncoderManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#commandencodermanager)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L263)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:255](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L255)

프래그먼트 셰이더 모듈명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### globalFragmentSlotIndex

#### Get Signature

> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:319](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L319)

##### Returns

`number`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`globalFragmentSlotIndex`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#globalfragmentslotindex)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:247](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L247)

머티리얼 모듈명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`name`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#name)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`revision`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#revision)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:271](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L271)

셰이더 storage 구조 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

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
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../../Material/type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:279](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L279)

셰이더 uniforms 구조 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

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

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

## Methods

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L485)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:373](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L373)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

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

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

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

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:327](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABaseMaterial.ts#L327)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`notifyUpdate`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#notifyupdate)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABitmapBaseMaterial.ts#L80)

샘플러 객체 변경 및 DirtyPipeline 리스너를 관리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 이전 샘플러
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 새 샘플러

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/ABitmapBaseMaterial.ts#L64)

텍스처 객체 변경 및 DirtyPipeline 리스너를 관리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | 이전 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)
| `texture` | [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | 새 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)


</details>
