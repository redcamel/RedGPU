[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeMaterial

# Class: LandscapeMaterial

Defined in: [src/landscape/LandscapeMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L21)

최대 8개의 `LandscapeLayer`를 `2d-array` 텍스처로 통합 관리하고 단일 공유 RGBA 가중치 맵(`weightTexture`)을 기반으로 VBT 베이킹 및 근거리 디테일 블렌딩을 수행하는 지형 전용 머티리얼 클래스입니다. `Landscape` 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// Landscape 인스턴스로부터 머티리얼 참조 및 근거리 디테일 거리 설정
const material = landscape.material;
material.nearDetailDistance = 300;
```

## See

[Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)

## Extends

- [`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors



***

### Constructor

> **new LandscapeMaterial**(`redGPUContext`, `baseColorHex?`, `textureArraySize?`): `LandscapeMaterial`

Defined in: [src/landscape/LandscapeMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L92)

`LandscapeMaterial` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `baseColorHex?` | `string` | `'#387d42'` | 초기 베이스 컬러 HEX 문자열 (기본값: `'#387d42'`) |
| `textureArraySize?` | `number` | `1024` | 레이어 `2d-array` 텍스처의 가로/세로 픽셀 해상도 (최솟값: `128`, 기본값: `1024`) |

#### Returns

`LandscapeMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties



***

### baseColor

> **baseColor**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/landscape/LandscapeMaterial.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L26)

레이어가 없을 때 사용되는 지형 기본 베이스 컬러

***

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/landscape/LandscapeMaterial.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L31)

지형 레이어 텍스처 샘플링에 사용되는 기본 샘플러

***

## Accessors



***

### layers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **layers**(): [`LandscapeLayer`](LandscapeLayer.md)[]

Defined in: [src/landscape/LandscapeMaterial.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L127)

현재 머티리얼에 등록된 `LandscapeLayer` 배열을 반환합니다.

##### Returns

[`LandscapeLayer`](LandscapeLayer.md)[]

`LandscapeLayer` 배열

***

***

### nearDetailDistance

#### Get Signature

> **get** **nearDetailDistance**(): `number`

Defined in: [src/landscape/LandscapeMaterial.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L139)

고해상도 근접 디테일 텍스처 블렌딩이 유지되는 최대 거리(월드 단위, 최솟값: `0`)를 반환하거나 설정합니다.

##### Returns

`number`

근접 디테일 블렌딩 거리

#### Set Signature

> **set** **nearDetailDistance**(`val`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

## Methods



***

### addLayer()

> **addLayer**(`layer`): `this`

Defined in: [src/landscape/LandscapeMaterial.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L251)

머티리얼에 새로운 `LandscapeLayer`를 추가하고 텍스처 배열 재구축을 예약합니다. (최대 8개)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | [`LandscapeLayer`](LandscapeLayer.md) | 추가할 `LandscapeLayer` 인스턴스 |

#### Returns

`this`

메서드 체이닝을 위한 현재 `LandscapeMaterial` 인스턴스

***

***

### clearLayers()

> **clearLayers**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L313)

등록된 모든 `LandscapeLayer`를 제거합니다.

#### Returns

`void`

***

***

### getInternalLayerViews()

> **getInternalLayerViews**(): `object`

Defined in: [src/landscape/LandscapeMaterial.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L169)

내부 레이어 `2d-array` 텍스처 뷰 객체(`baseColorView`, `normalView`, `ormView`, `weightMapView`)를 반환합니다.

#### Returns

`object`

레이어 텍스처 배열 뷰 모음 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `baseColorView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L170) |
| `normalView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L171) |
| `ormView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L172) |
| `weightMapView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L173) |

***

***

### getLayer()

> **getLayer**(`layerName`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/LandscapeMaterial.ts:330](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L330)

지정된 이름과 일치하는 `LandscapeLayer`를 찾아 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layerName` | `string` | 조회할 레이어 이름 |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

일치하는 `LandscapeLayer` 인스턴스 또는 `undefined`

***

***

### removeLayer()

> **removeLayer**(`layer`): `boolean`

Defined in: [src/landscape/LandscapeMaterial.ts:288](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L288)

지정된 `LandscapeLayer` 인스턴스 또는 이름과 일치하는 레이어를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | `string` \| [`LandscapeLayer`](LandscapeLayer.md) | 제거할 `LandscapeLayer` 인스턴스 또는 레이어 이름 |

#### Returns

`boolean`

제거 성공 여부

***

***

### requestVBTRebake()

> **requestVBTRebake**(`immediate?`, `debounceDelayMs?`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L205)

레이어 텍스처 배열의 밉맵을 갱신하고 VBT 아틀라스 리베이킹을 요청합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `immediate?` | `boolean` | `false` | 디바운스 지연 없이 마이크로태스크로 즉시 실행할지 여부 (기본값: `false`) |
| `debounceDelayMs?` | `number` | `200` | 디바운스 대기 시간(밀리초, 기본값: `200`) |

#### Returns

`void`

***

***

### setOnRebakeVBTRequested()

> **setOnRebakeVBTRequested**(`callback?`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L190)

VBT 아틀라스 리베이킹이 요청될 때 실행할 콜백 함수를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback?` | () => `void` | VBT 리베이킹 요청 시 호출될 콜백 함수 |

#### Returns

`void`

***

***

### updateUniformsData()

> **updateUniformsData**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:344](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L344)

머티리얼과 모든 활성 레이어의 유니폼 데이터를 패킹하여 프래그먼트 유니폼 GPU 버퍼에 업로드합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L24)

프래그먼트 상태 갱신 시 실행되는 텍스처 패킹 콜백 함수 목록

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L74)

파이프라인 갱신 필요 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L32)

텍스처 UV 변환 정보 변경 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../../Material/namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L69)

프래그먼트 GPU 렌더 파이프라인 정보 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L42)

머티리얼 인스턴스 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isInstanceofMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L27)

머티리얼의 불투명도 (0.0 ~ 1.0)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L32)

머티리얼의 틴트 컬러 (ColorRGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L79)

머티리얼 투명 렌더링 활성화 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L64)

2패스 렌더링 사용 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L37)

틴트 컬러 적용 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`antialiasingManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L277)

알파 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

알파 BlendState 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L265)

컬러 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

컬러 BlendState 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`commandEncoderManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L217)

프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.

##### Returns

`string`

바인드 그룹 디스크립터 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L205)

프래그먼트 셰이더 모듈 이름을 반환합니다.

##### Returns

`string`

프래그먼트 셰이더 모듈 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L305)

글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.

##### Returns

`number`

할당된 슬롯 인덱스 (미할당 시 `-1`)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`globalFragmentSlotIndex`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`instanceId`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L193)

머티리얼 모듈 이름을 반환합니다.

##### Returns

`string`

모듈 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`revision`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L241)

파싱된 WGSL 셰이더 전체 정보를 반환합니다.

##### Returns

`any`

파싱된 셰이더 정보 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`SHADER_INFO`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L229)

파싱된 셰이더 스토리지 구조체 정보를 반환합니다.

##### Returns

`any`

스토리지 구조체 정보

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L71)

텍스처 UV 오프셋 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 오프셋 튜플 `[u, v]` (기본값: `[0, 0]`)

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L88)

텍스처 UV 타일링 스케일 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 스케일 튜플 `[u, v]` (기본값: `[1, 1]`)

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L160)

현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.

##### Throws

유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생

##### Returns

`string`

틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../Material/type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L253)

파싱된 셰이더 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L289)

컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.

##### Returns

`number`

GPUFlagsConstant 값

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L461)

머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:384](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L384)

프래그먼트 렌더 상태, 유니폼 버퍼 및 바인드 그룹을 갱신합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L465)

머티리얼의 `2d-array` GPU 텍스처 리소스, 타이머 및 등록된 모든 레이어를 해제합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`destroy`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L430)

GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`) |

#### Returns

`GPUFragmentState`

구성된 GPUFragmentState 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L502)

Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 인스턴스 |

#### Returns

`GPUSampler`

GPUSampler 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L313)

GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`notifyUpdate`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L80)

샘플러 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 이전에 바인딩된 Sampler 인스턴스 |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 새로 바인딩할 Sampler 인스턴스 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L63)

텍스처 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | 이전에 바인딩된 텍스처 객체 |
| `texture` | `any` | 새로 바인딩할 텍스처 객체 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)

***

</details>
