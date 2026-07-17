[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:77](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L77)

RedGPU의 모든 GPU 리소스를 통합 관리하는 핵심 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

* ### Example
```typescript
// RedGPUContext를 통해 접근합니다.
const resourceManager = redGPUContext.resourceManager;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new ResourceManager**(`redGPUContext`): `ResourceManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:134](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L134)

ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`ResourceManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:80](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L80)

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:79](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L79)

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:82](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L82)

***

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:78](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L78)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:81](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L81)

## Accessors

### basicDisplacementSampler

#### Get Signature

> **get** **basicDisplacementSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:210](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L210)

기본 디스플레이스먼트 맵용 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

displacement Sampler 인스턴스

***

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:198](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L198)

기본 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

기본 Sampler 인스턴스

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:222](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L222)

BRDF 생성기를 반환합니다.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator 인스턴스

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:310](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L310)

캐시된 버퍼 상태를 반환합니다.

##### Returns

`any`

캐시된 버퍼 상태 객체

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:298](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L298)

큐브맵 다운샘플링 생성기를 반환합니다.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator 인스턴스

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:322](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L322)

빈 비트맵 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 비트맵 GPUTextureView

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:334](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L334)

빈 큐브 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 큐브 GPUTextureView

***

### emptyDepthTextureView

#### Get Signature

> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:358](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L358)

빈 깊이 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 깊이 GPUTextureView

***

### emptyTexture3DView

#### Get Signature

> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:346](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L346)

빈 3D 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 3D GPUTextureView

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:258](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L258)

Equirectangular(2D)를 CubeMap으로 변환하는 생성기를 반환합니다.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator 인스턴스

***

### GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN

#### Get Signature

> **get** **GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:162](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L162)

##### Returns

`any`

***

### GLOBAL\_FRAGMENT\_STRUCT\_PBR

#### Get Signature

> **get** **GLOBAL\_FRAGMENT\_STRUCT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:158](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L158)

##### Returns

`any`

***

### GLOBAL\_VERTEX\_STRUCT

#### Get Signature

> **get** **GLOBAL\_VERTEX\_STRUCT**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:166](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L166)

##### Returns

`any`

***

### gltfCacheManager

#### Get Signature

> **get** **gltfCacheManager**(): `GLTFCacheManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:274](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L274)

GLTF 캐시 매니저를 반환합니다.

##### Returns

`GLTFCacheManager`

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:234](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L234)

Irradiance 생성기를 반환합니다.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator 인스턴스

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:370](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L370)

비트맵 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

비트맵 텍스처 관리 상태 정보 객체

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:382](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L382)

큐브 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

큐브 텍스처 관리 상태 정보 객체

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:394](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L394)

HDR 텍스처 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

HDR 텍스처 관리 상태 정보 객체

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:430](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L430)

인덱스 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

인덱스 버퍼 관리 상태 정보 객체

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:442](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L442)

Storage 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

스토리지 버퍼 관리 상태 정보 객체

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:406](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L406)

유니폼 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

유니폼 버퍼 관리 상태 정보 객체

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:418](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L418)

버텍스 버퍼 관리 상태를 반환합니다.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

버텍스 버퍼 관리 상태 정보 객체

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:286](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L286)

밉맵 생성기를 반환합니다.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator 인스턴스

***

### packedTextureManager

#### Get Signature

> **get** **packedTextureManager**(): `PackedTextureManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:266](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L266)

텍스처 패킹 매니저를 반환합니다.

##### Returns

`PackedTextureManager`

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:246](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L246)

Prefilter 생성기를 반환합니다.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator 인스턴스

***

### resources

#### Get Signature

> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:454](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L454)

내부 리소스 맵을 반환합니다.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

ImmutableKeyMap 기반 리소스 맵

***

### SHADER\_INFO\_BASIC

#### Get Signature

> **get** **SHADER\_INFO\_BASIC**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:174](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L174)

##### Returns

`any`

***

### SHADER\_INFO\_ONLY\_FRAGMENT\_PBR

#### Get Signature

> **get** **SHADER\_INFO\_ONLY\_FRAGMENT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:178](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L178)

##### Returns

`any`

***

### SHADER\_INFO\_ONLY\_VERTEX\_PBR

#### Get Signature

> **get** **SHADER\_INFO\_ONLY\_VERTEX\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:182](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L182)

##### Returns

`any`

***

### SHADER\_INFO\_PBR

#### Get Signature

> **get** **SHADER\_INFO\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:170](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L170)

##### Returns

`any`

***

### wgslParser

#### Get Signature

> **get** **wgslParser**(): `WGSLParser`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:186](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L186)

##### Returns

`WGSLParser`

## Methods

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:795](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L795)

GPUBindGroupLayout을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름
| `bindGroupLayoutDescriptor` | `GPUBindGroupLayoutDescriptor` | 바인드 그룹 레이아웃 디스크립터

#### Returns

`GPUBindGroupLayout`

GPUBindGroupLayout

***

### createGPUBuffer()

> **createGPUBuffer**(`name`, `gpuBufferDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:862](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L862)

GPUBuffer를 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 버퍼 이름
| `gpuBufferDescriptor` | `GPUBufferDescriptor` | 버퍼 디스크립터

#### Returns

`any`

생성된 GPUBuffer

***

### createGPUPipelineLayout()

> **createGPUPipelineLayout**(`name`, `gpuPipelineLayoutDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:841](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L841)

GPUPipelineLayout을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름
| `gpuPipelineLayoutDescriptor` | `GPUPipelineLayoutDescriptor` | 파이프라인 레이아웃 디스크립터

#### Returns

`any`

GPUPipelineLayout

***

### createGPUShaderModule()

> **createGPUShaderModule**(`name`, `gpuShaderModuleDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:751](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L751)

GPUShaderModule을 생성하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름
| `gpuShaderModuleDescriptor` | `GPUShaderModuleDescriptor` | 셰이더 모듈 디스크립터

#### Returns

`any`

생성된 GPUShaderModule

***

### createManagedTexture()

> **createManagedTexture**(`desc`): `GPUTexture`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:641](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L641)

GPU 텍스처를 생성하고 관리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | 텍스처 디스크립터

#### Returns

`GPUTexture`

생성된 GPUTexture

***

### createSampler()

> **createSampler**(`descriptorKey`, `samplerOptions`): `GPUSampler`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:462](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L462)

캐시에서 샘플러를 조회하거나 존재하지 않으면 새로 생성하여 반환합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `descriptorKey` | `string` |
| `samplerOptions` | `GPUSamplerDescriptor` |

#### Returns

`GPUSampler`

***

### deleteGPUBindGroupLayout()

> **deleteGPUBindGroupLayout**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:824](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L824)

GPUBindGroupLayout을 삭제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름

#### Returns

`void`

***

### deleteGPUShaderModule()

> **deleteGPUShaderModule**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:778](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L778)

GPUShaderModule을 삭제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:513](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L513)

ResourceManager 인스턴스를 파기하고 캐싱된 모든 WebGPU 자원들을 물리적으로 해제합니다.

#### Returns

`void`

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:813](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L813)

캐싱된 GPUBindGroupLayout을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 레이아웃 이름

#### Returns

`GPUBindGroupLayout`

GPUBindGroupLayout

***

### getGPUResourceBitmapTextureView()

> **getGPUResourceBitmapTextureView**(`texture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:664](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L664)

비트맵 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `any` | 대상 텍스처 (BitmapTexture, PackedTexture, DirectTexture 또는 GPUTexture)
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택)

#### Returns

`GPUTextureView`

GPUTextureView

***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:708](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L708)

큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `any` | 대상 큐브 텍스처 (CubeTexture, DirectCubeTexture 또는 GPUTexture)
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택)

#### Returns

`GPUTextureView`

GPUTextureView

***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:767](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L767)

캐싱된 GPUShaderModule을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름

#### Returns

`GPUShaderModule`

GPUShaderModule

***

### initPresets()

> **initPresets**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:874](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L874)

시스템 프리셋을 초기화합니다.

#### Returns

`void`

***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:480](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L480)

리소스를 관리 대상으로 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 대상 리소스
| `resourceState` | [`ResourceState`](../type-aliases/ResourceState.md) | 리소스 상태 정보

#### Returns

`void`

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:498](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L498)

리소스를 관리 대상에서 해제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 대상 리소스

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): `ResourceManager`

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

`ResourceManager`

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
