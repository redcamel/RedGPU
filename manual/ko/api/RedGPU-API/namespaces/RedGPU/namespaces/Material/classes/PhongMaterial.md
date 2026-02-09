[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PhongMaterial

# Class: PhongMaterial

Defined in: [src/material/phongMaterial/PhongMaterial.ts:16](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L16)

Phong 라이팅 기반의 다양한 텍스처/파라미터를 지원하는 머티리얼 클래스입니다.


디퓨즈, 스펙큘러, 노멀, AO, 알파, 발광 등 다양한 텍스처와 샘플러, 파라미터를 통해 사실적인 라이팅 효과를 구현할 수 있습니다.

* ### Example
```typescript
const sourceTexture = new RedGPU.Resource.BitmapTexture(
   redGPUContext,
   'https://redcamel.github.io/RedGPU/examples/assets/github.png'
);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = sourceTexture;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/phongMaterial/"></iframe>

## See

[PhongMaterial Texture Combination example](https://redcamel.github.io/RedGPU/examples/3d/material/phongMaterialTextures/)

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors

### Constructor

> **new PhongMaterial**(`redGPUContext`, `color`, `name?`): `PhongMaterial`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L171)

PhongMaterial 생성자


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `color` | `string` | `'#fff'` | 기본 색상 (HEX 문자열, 기본값: '#fff')
| `name?` | `string` | `undefined` | 머티리얼 이름 (옵션)

#### Returns

`PhongMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L22)

파이프라인 갱신 시 호출되는 콜백 리스트


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

### alphaTexture

> **alphaTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L46)

알파(투명도) 텍스처


***

### alphaTextureSampler

> **alphaTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L51)

알파 텍스처 샘플러


***

### aoTexture

> **aoTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:86](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L86)

AO(ambient occlusion) 텍스처


***

### aoTextureSampler

> **aoTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:91](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L91)

AO 텍스처 샘플러


***

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L21)

머티리얼의 기본 색상(RGB)


***

### diffuseTexture

> **diffuseTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L56)

디퓨즈 텍스처


***

### diffuseTextureSampler

> **diffuseTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L61)

디퓨즈 텍스처 샘플러


***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L62)

파이프라인 dirty 상태 플래그


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L29)

텍스처 트랜스폼 변경 여부 플래그


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

### emissiveColor

> **emissiveColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:26](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L26)

발광 색상(RGB)


***

### emissiveStrength

> **emissiveStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:31](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L31)

발광 강도


***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:76](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L76)

발광 텍스처


***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L81)

발광 텍스처 샘플러


***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L57)

프래그먼트 GPU 렌더 정보 객체


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

### metallic

> **metallic**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:111](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L111)

금속도


***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:106](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L106)

노멀 맵 스케일


***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:96](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L96)

노멀 맵 텍스처


***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L101)

노멀 맵 텍스처 샘플러


***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L23)

머티리얼의 불투명도(0~1)


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

### roughness

> **roughness**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:116](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L116)

거칠기


***

### specularColor

> **specularColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:36](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L36)

스펙큘러 색상(RGB)


***

### specularStrength

> **specularStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:41](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L41)

스펙큘러 강도


***

### specularTexture

> **specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L66)

스펙큘러 텍스처


***

### specularTextureSampler

> **specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L71)

스펙큘러 텍스처 샘플러


***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L28)

머티리얼의 틴트 컬러(RGBA)


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L67)

머티리얼 투명도 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L52)

2패스 렌더링 사용 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

### useSSR

> **useSSR**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L121)

SSR(스크린 스페이스 리플렉션) 사용 여부


***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L33)

틴트 컬러 사용 여부


#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L289)

머티리얼의 알파 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L281)

머티리얼의 컬러 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L65)

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

### displacementScale

#### Get Signature

> **get** **displacementScale**(): `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:192](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L192)

디스플레이스먼트(변위) 스케일을 반환합니다.


##### Returns

`number`

스케일 값


#### Set Signature

> **set** **displacementScale**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:203](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L203)

디스플레이스먼트(변위) 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

***

### displacementTexture

#### Get Signature

> **get** **displacementTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:214](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L214)

디스플레이스먼트(변위) 텍스처를 반환합니다.


##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

BitmapTexture


#### Set Signature

> **set** **displacementTexture**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/phongMaterial/PhongMaterial.ts#L225)

디스플레이스먼트(변위) 텍스처를 설정하고 파이프라인을 갱신합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) | BitmapTexture

##### Returns

`void`

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L257)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L249)

프래그먼트 셰이더 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L241)

머티리얼 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L90)

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

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L265)

셰이더 storage 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L43)

텍스처 오프셋 (u, v)


### Example
```typescript
material.textureOffset = [0.5, 0.5];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L47)

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

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L61)

텍스처 스케일 (u, v)


### Example
```typescript
material.textureScale = [2.0, 2.0];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L65)

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

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L205)

틴트 블렌드 모드 이름을 반환합니다.


##### Returns

`string`

틴트 블렌드 모드 이름


#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L220)

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

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L273)

셰이더 uniforms 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L297)

머티리얼의 writeMask 상태 반환


##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L308)

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

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L125)

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

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L152)

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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L137)

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

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L463)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L351)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L431)

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

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L488)

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

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L316)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L75)

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

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L59)

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
