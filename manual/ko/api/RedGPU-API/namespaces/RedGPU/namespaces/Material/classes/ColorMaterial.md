[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / ColorMaterial

# Class: ColorMaterial

Defined in: [src/material/colorMaterial/ColorMaterial.ts:11](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/colorMaterial/ColorMaterial.ts#L11)

단색(솔리드 컬러) 렌더링을 위한 머티리얼 클래스입니다.

ColorRGB 기반의 색상 지정이 가능하며, GPU 파이프라인에서 단일 색상으로 오브젝트를 렌더링할 때 사용합니다.
```typescript
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/colorMaterial/"></iframe>

## Extends

- [`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md)

## Constructors

### Constructor

> **new ColorMaterial**(`redGPUContext`, `color?`): `ColorMaterial`

Defined in: [src/material/colorMaterial/ColorMaterial.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/colorMaterial/ColorMaterial.ts#L45)

ColorMaterial 생성자

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `color` | `string` | `'#fff'` | HEX 문자열 또는 컬러 코드(기본값: '#fff')

#### Returns

`ColorMaterial`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABaseMaterial.md#constructor)

## Properties

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/colorMaterial/ColorMaterial.ts:16](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/colorMaterial/ColorMaterial.ts#L16)

머티리얼의 단색 컬러(ColorRGB)

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L69)

파이프라인 dirty 상태 플래그

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L64)

프래그먼트 GPU 렌더 정보 객체

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABaseMaterial.md#gpurenderinfo)

***

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`instanceId`](../namespaces/Core/classes/ABaseMaterial.md#instanceid)

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L35)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`isInstanceofMaterial`](../namespaces/Core/classes/ABaseMaterial.md#isinstanceofmaterial)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L24)

머티리얼의 불투명도(0~1)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L29)

머티리얼의 틴트 컬러(RGBA)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tint`](../namespaces/Core/classes/ABaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L74)

머티리얼 투명도 여부

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L59)

2패스 렌더링 사용 여부

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L34)

틴트 컬러 사용 여부

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABaseMaterial.md#usetint)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`antialiasingManager`](../namespaces/Core/classes/ABaseMaterial.md#antialiasingmanager)

***

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:295](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L295)

머티리얼의 알파 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:287](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L287)

머티리얼의 컬러 블렌드 상태 객체 반환

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L53)

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L61)

캐시 키를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/ABaseMaterial.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`commandEncoderManager`](../namespaces/Core/classes/ABaseMaterial.md#commandencodermanager)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L263)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:255](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L255)

프래그먼트 셰이더 모듈명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_shader_module_name)

***

### globalFragmentSlotIndex

#### Get Signature

> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:319](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L319)

##### Returns

`number`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`globalFragmentSlotIndex`](../namespaces/Core/classes/ABaseMaterial.md#globalfragmentslotindex)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:247](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L247)

머티리얼 모듈명을 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`name`](../namespaces/Core/classes/ABaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABaseMaterial.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`resourceManager`](../namespaces/Core/classes/ABaseMaterial.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABaseMaterial.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`revision`](../namespaces/Core/classes/ABaseMaterial.md#revision)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:271](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L271)

셰이더 storage 구조 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:210](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L210)

틴트 블렌드 모드 이름을 반환합니다.

##### Returns

`string`

틴트 블렌드 모드 이름

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L225)

틴트 블렌드 모드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:279](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L279)

셰이더 uniforms 구조 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:303](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L303)

머티리얼의 writeMask 상태 반환

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:314](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L314)

머티리얼의 writeMask 상태 설정

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant 값

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/ABaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L89)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ABaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L101)

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ABaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L485)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:373](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L373)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:453](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L453)

GPU 프래그먼트 렌더 상태 객체를 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | 셰이더 엔트리포인트 (기본값: 'main')

#### Returns

`GPUFragmentState`

GPU 프래그먼트 상태

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L510)

샘플러 객체에서 GPU 샘플러를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

GPUSampler 인스턴스

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:327](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/material/core/ABaseMaterial.ts#L327)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABaseMaterial.md#initgpurenderinfos)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L116)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`notifyUpdate`](../namespaces/Core/classes/ABaseMaterial.md#notifyupdate)


</details>
