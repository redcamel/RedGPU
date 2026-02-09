[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / BitmapMaterial

# Class: BitmapMaterial

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:15](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/bitmapMaterial/BitmapMaterial.ts#L15)

비트맵 텍스처 기반의 머티리얼 클래스입니다.


BitmapTexture와 Sampler를 통해 다양한 텍스처 기반 렌더링 효과를 구현할 수 있습니다.

* ### Example
```typescript
const sourceTexture = new RedGPU.Resource.BitmapTexture(
   redGPUContext,
   'https://redcamel.github.io/RedGPU/examples/assets/github.png'
);
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, sourceTexture);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/bitmapMaterial/"></iframe>

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors

### Constructor

> **new BitmapMaterial**(`redGPUContext`, `diffuseTexture?`, `name?`): `BitmapMaterial`

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/bitmapMaterial/BitmapMaterial.ts#L66)

BitmapMaterial 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `diffuseTexture?` | [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) | 적용할 비트맵 텍스처
| `name?` | `string` | 머티리얼 이름(옵션)

#### Returns

`BitmapMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L22)

파이프라인 갱신 시 호출되는 콜백 리스트


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

### diffuseTexture

> **diffuseTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:20](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/bitmapMaterial/BitmapMaterial.ts#L20)

머티리얼에 적용할 비트맵 텍스처


***

### diffuseTextureSampler

> **diffuseTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:25](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/bitmapMaterial/BitmapMaterial.ts#L25)

비트맵 텍스처 샘플러


***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/bitmapMaterial/BitmapMaterial.ts#L51)

파이프라인 dirty 상태 플래그


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/AUVTransformBaseMaterial.ts#L29)

텍스처 트랜스폼 변경 여부 플래그


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L57)

프래그먼트 GPU 렌더 정보 객체


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L23)

머티리얼의 불투명도(0~1)


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L28)

머티리얼의 틴트 컬러(RGBA)


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L67)

머티리얼 투명도 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L52)

2패스 렌더링 사용 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L33)

틴트 컬러 사용 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L289)

머티리얼의 알파 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L281)

머티리얼의 컬러 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L257)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L249)

프래그먼트 셰이더 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L241)

머티리얼 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L265)

셰이더 storage 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/AUVTransformBaseMaterial.ts#L43)

텍스처 오프셋 (u, v)


### Example
```typescript
material.textureOffset = [0.5, 0.5];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:47](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/AUVTransformBaseMaterial.ts#L47)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/AUVTransformBaseMaterial.ts#L61)

텍스처 스케일 (u, v)


### Example
```typescript
material.textureScale = [2.0, 2.0];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:65](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/AUVTransformBaseMaterial.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

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
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L273)

셰이더 uniforms 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__firelistenerlist)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L463)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L351)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

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

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L488)

샘플러 객체에서 GPU 샘플러를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

GPUSampler 인스턴스


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABaseMaterial.ts#L316)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L75)

샘플러 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 이전 샘플러
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 새 샘플러

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/material/core/ABitmapBaseMaterial.ts#L59)

텍스처 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 이전 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)
| `texture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 새 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)
