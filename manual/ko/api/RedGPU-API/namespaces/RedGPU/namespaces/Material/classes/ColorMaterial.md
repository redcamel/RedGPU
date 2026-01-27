[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / ColorMaterial

# Class: ColorMaterial

Defined in: [src/material/colorMaterial/ColorMaterial.ts:10](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/colorMaterial/ColorMaterial.ts#L10)

단색(솔리드 컬러) 렌더링을 위한 머티리얼 클래스입니다.


ColorRGB 기반의 색상 지정이 가능하며, GPU 파이프라인에서 단일 색상으로 오브젝트를 렌더링할 때 사용합니다.

* ### Example
```typescript
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/colorMaterial/"></iframe>

## Extends

- [`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md)

## Constructors

### Constructor

> **new ColorMaterial**(`redGPUContext`, `color`): `ColorMaterial`

Defined in: [src/material/colorMaterial/ColorMaterial.ts:44](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/colorMaterial/ColorMaterial.ts#L44)

ColorMaterial 생성자


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `color` | `string` | `'#fff'` | HEX 문자열 또는 컬러 코드(기본값: '#fff')

#### Returns

`ColorMaterial`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABaseMaterial.md#constructor)

## Properties

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/colorMaterial/ColorMaterial.ts:15](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/colorMaterial/ColorMaterial.ts#L15)

머티리얼의 단색 컬러(ColorRGB)


***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L61)

파이프라인 dirty 상태 플래그


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L56)

프래그먼트 GPU 렌더 정보 객체


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABaseMaterial.md#gpurenderinfo)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L22)

머티리얼의 불투명도(0~1)


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L27)

머티리얼의 틴트 컬러(RGBA)


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tint`](../namespaces/Core/classes/ABaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L66)

머티리얼 투명도 여부


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L51)

2패스 렌더링 사용 여부


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L32)

틴트 컬러 사용 여부


#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:245](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L245)

머티리얼의 알파 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:237](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L237)

머티리얼의 컬러 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L65)

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

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:221](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L221)

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L217)

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:213](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L213)

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`name`](../namespaces/Core/classes/ABaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L225)

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:188](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L188)

##### Returns

`string`

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L229)

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L253)

머티리얼의 writeMask 상태 반환


##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:264](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L264)

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

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L125)

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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/ABaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


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

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:414](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L414)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:306](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L306)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등 상태 갱신


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:383](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L383)

GPU 프래그먼트 렌더 상태 객체 반환


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | 셰이더 엔트리포인트(기본값: 'main')

#### Returns

`GPUFragmentState`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:436](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L436)

샘플러 객체에서 GPU 샘플러 반환


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:272](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/material/core/ABaseMaterial.ts#L272)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼 초기화


#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABaseMaterial.md#initgpurenderinfos)
