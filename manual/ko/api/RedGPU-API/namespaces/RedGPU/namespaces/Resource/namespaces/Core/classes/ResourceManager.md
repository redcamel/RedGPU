[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L87)

RedGPU의 모든 GPU 리소스를 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// RedGPUContext를 통해 접근합니다.
const resourceManager = redGPUContext.resourceManager;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new ResourceManager**(`redGPUContext`): `ResourceManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L170)

ResourceManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`ResourceManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L102)

전역 정점 바인드 그룹 레이아웃 프리셋 키

***

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L97)

인스턴싱 전역 정점 바인드 그룹 레이아웃 프리셋 키

***

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L112)

스키닝 전역 정점 바인드 그룹 레이아웃 프리셋 키

***

***

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L92)

시스템 공용 바인드 그룹 레이아웃 프리셋 키

***

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L107)

정점 바인드 그룹 레이아웃 프리셋 키

## Accessors



***

### basicDisplacementSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicDisplacementSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L309)

기본 디스플레이스먼트 맵용 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

디스플레이스먼트용 Sampler 인스턴스

***

***

### basicSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L297)

기본 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

기본 Sampler 인스턴스

***

***

### brdfGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L321)

BRDF 생성기를 반환합니다.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator 인스턴스

***

***

### cachedBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:417](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L417)

캐시된 버퍼 상태 객체를 반환합니다.

##### Returns

`any`

캐시된 버퍼 상태 객체

***

***

### downSampleCubeMapGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:405](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L405)

큐브맵 다운샘플링 생성기를 반환합니다.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator 인스턴스

***

***

### emptyBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBindGroup**(): `GPUBindGroup`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:519](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L519)

전역 공용 빈 바인드 그룹(`entries: []`)을 반환합니다.

##### Returns

`GPUBindGroup`

빈 GPUBindGroup 인스턴스

***

***

### emptyBindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:501](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L501)

전역 공용 빈 바인드 그룹 레이아웃(`entries: []`)을 반환합니다.

##### Returns

`GPUBindGroupLayout`

빈 GPUBindGroupLayout 인스턴스

***

***

### emptyBitmapTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:429](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L429)

빈 비트맵 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 비트맵 GPUTextureView

***

***

### emptyCubeTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:453](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L453)

빈 큐브 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 큐브 GPUTextureView

***

***

### emptyDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:477](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L477)

빈 깊이 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 깊이 GPUTextureView

***

***

### emptyR32FloatTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyR32FloatTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:489](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L489)

빈 1x1 R32Float 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 R32Float GPUTextureView

***

***

### emptyTexture2DArrayView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyTexture2DArrayView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:441](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L441)

빈 2D 텍스처 배열 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 2D 배열 GPUTextureView

***

***

### emptyTexture3DView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:465](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L465)

빈 3D 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 3D GPUTextureView

***

***

### equirectangularToCubeGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L357)

Equirectangular(2D)를 CubeMap으로 변환하는 생성기를 반환합니다.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator 인스턴스

***

***

### GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L213)

빌트인 전역 프래그먼트 구조체 포맷 정보를 반환합니다.

##### Returns

`any`

빌트인 전역 프래그먼트 구조체 포맷 정보

***

***

### GLOBAL\_FRAGMENT\_STRUCT\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_FRAGMENT\_STRUCT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L201)

PBR 전역 프래그먼트 구조체 포맷 정보를 반환합니다.

##### Returns

`any`

PBR 전역 프래그먼트 구조체 포맷 정보

***

***

### GLOBAL\_VERTEX\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_VERTEX\_STRUCT**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L225)

전역 정점 구조체 포맷 정보를 반환합니다.

##### Returns

`any`

전역 정점 구조체 포맷 정보

***

***

### gltfCacheManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gltfCacheManager**(): `GLTFCacheManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:381](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L381)

GLTF 캐시 매니저를 반환합니다.

##### Returns

`GLTFCacheManager`

GLTFCacheManager 인스턴스

***

***

### irradianceGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L333)

Irradiance 생성기를 반환합니다.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator 인스턴스

***

***

### managedBitmapTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:538](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L538)

비트맵 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

비트맵 텍스처 관리 상태 정보 객체

***

***

### managedCubeTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:562](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L562)

큐브 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

큐브 텍스처 관리 상태 정보 객체

***

***

### managedHDRTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:574](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L574)

HDR 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

HDR 텍스처 관리 상태 정보 객체

***

***

### managedIndexBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:610](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L610)

인덱스 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

인덱스 버퍼 관리 상태 정보 객체

***

***

### managedStorageBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:622](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L622)

스토리지 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

스토리지 버퍼 관리 상태 정보 객체

***

***

### managedTextureArrayState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedTextureArrayState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:550](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L550)

텍스처 배열 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

텍스처 배열 관리 상태 정보 객체

***

***

### managedUniformBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:586](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L586)

유니폼 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

유니폼 버퍼 관리 상태 정보 객체

***

***

### managedVertexBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L598)

정점 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

정점 버퍼 관리 상태 정보 객체

***

***

### mipmapGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:393](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L393)

밉맵 생성기를 반환합니다.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator 인스턴스

***

***

### packedTextureManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedTextureManager**(): `PackedTextureManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:369](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L369)

패킹 텍스처 매니저를 반환합니다.

##### Returns

`PackedTextureManager`

PackedTextureManager 인스턴스

***

***

### prefilterGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L345)

Prefilter 생성기를 반환합니다.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator 인스턴스

***

***

### resources

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:634](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L634)

내부 리소스 맵을 반환합니다.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

`ImmutableKeyMap` 기반 리소스 맵

***

***

### SHADER\_INFO\_BASIC

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_BASIC**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L249)

기본 메시 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

기본 메시 셰이더 정보

***

***

### SHADER\_INFO\_ONLY\_FRAGMENT\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_ONLY\_FRAGMENT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L261)

프래그먼트 전용 PBR 메시 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

프래그먼트 전용 PBR 메시 셰이더 정보

***

***

### SHADER\_INFO\_ONLY\_VERTEX\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_ONLY\_VERTEX\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:273](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L273)

정점 전용 PBR 메시 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

정점 전용 PBR 메시 셰이더 정보

***

***

### SHADER\_INFO\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L237)

PBR 메시 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

PBR 메시 셰이더 정보

***

***

### wgslParser

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **wgslParser**(): `WGSLParser`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L285)

WGSL 파서 인스턴스를 반환합니다.

##### Returns

`WGSLParser`

WGSLParser 인스턴스

## Methods



***

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1016](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1016)

GPUBindGroupLayout을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름 |
| `bindGroupLayoutDescriptor` | `GPUBindGroupLayoutDescriptor` | 바인드 그룹 레이아웃 디스크립터 |

#### Returns

`GPUBindGroupLayout`

생성된 GPUBindGroupLayout

***

***

### createGPUBuffer()

> **createGPUBuffer**(`name`, `gpuBufferDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1087](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1087)

GPUBuffer를 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 버퍼 이름 |
| `gpuBufferDescriptor` | `GPUBufferDescriptor` | 버퍼 디스크립터 |

#### Returns

`any`

생성된 GPUBuffer

***

***

### createGPUPipelineLayout()

> **createGPUPipelineLayout**(`name`, `gpuPipelineLayoutDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1065](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1065)

GPUPipelineLayout을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 파이프라인 레이아웃 이름 |
| `gpuPipelineLayoutDescriptor` | `GPUPipelineLayoutDescriptor` | 파이프라인 레이아웃 디스크립터 |

#### Returns

`any`

생성된 GPUPipelineLayout

***

***

### createGPUShaderModule()

> **createGPUShaderModule**(`name`, `gpuShaderModuleDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:969](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L969)

GPUShaderModule을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름 |
| `gpuShaderModuleDescriptor` | `GPUShaderModuleDescriptor` | 셰이더 모듈 디스크립터 |

#### Returns

`any`

생성된 GPUShaderModule

***

***

### createManagedTexture()

> **createManagedTexture**(`desc`): `GPUTexture`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:841](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L841)

관리형 GPU 텍스처를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | 텍스처 디스크립터 |

#### Returns

`GPUTexture`

생성된 GPUTexture 인스턴스

***

***

### createSampler()

> **createSampler**(`descriptorKey`, `samplerOptions`): `GPUSampler`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:652](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L652)

캐시에서 샘플러를 조회하거나 존재하지 않으면 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptorKey` | `string` | 샘플러 디스크립터 캐시 키 |
| `samplerOptions` | `GPUSamplerDescriptor` | GPUSamplerDescriptor 옵션 객체 |

#### Returns

`GPUSampler`

캐싱되었거나 새로 생성된 GPUSampler

***

***

### deleteGPUBindGroupLayout()

> **deleteGPUBindGroupLayout**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1047](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1047)

캐싱된 GPUBindGroupLayout을 삭제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름 |

#### Returns

`void`

***

***

### deleteGPUShaderModule()

> **deleteGPUShaderModule**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:998](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L998)

캐싱된 GPUShaderModule을 삭제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름 |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:705](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L705)

ResourceManager 인스턴스를 파기하고 캐싱된 모든 WebGPU 자원들을 해제합니다.

#### Returns

`void`

***

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1035](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1035)

캐싱된 GPUBindGroupLayout을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름 |

#### Returns

`GPUBindGroupLayout`

캐싱된 GPUBindGroupLayout

***

***

### getGPUResourceBitmapTextureView()

> **getGPUResourceBitmapTextureView**(`texture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:865](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L865)

비트맵 텍스처의 뷰를 캐시에서 가져오거나 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `any` | 대상 텍스처 (BitmapTexture, PackedTexture, DirectTexture 또는 GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택) |

#### Returns

`GPUTextureView`

GPUTextureView 인스턴스 또는 null

***

***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:925](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L925)

큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `any` | 대상 큐브 텍스처 (CubeTexture, DirectCubeTexture 또는 GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택) |

#### Returns

`GPUTextureView`

GPUTextureView 인스턴스 또는 null

***

***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:986](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L986)

캐싱된 GPUShaderModule을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름 |

#### Returns

`GPUShaderModule`

캐싱된 GPUShaderModule

***

***

### initPresets()

> **initPresets**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1099](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L1099)

시스템 프리셋 리소스들을 초기화합니다.

#### Returns

`void`

***

***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:671](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L671)

리소스를 관리 대상으로 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 등록할 대상 리소스 |
| `resourceState` | [`ResourceState`](../type-aliases/ResourceState.md) | 리소스 상태 정보 |

#### Returns

`void`

***

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:690](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/ResourceManager.ts#L690)

리소스를 관리 대상에서 해제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 해제할 대상 리소스 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`LakeWaveSimulator`](../../../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): `ResourceManager`

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

`ResourceManager`

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
