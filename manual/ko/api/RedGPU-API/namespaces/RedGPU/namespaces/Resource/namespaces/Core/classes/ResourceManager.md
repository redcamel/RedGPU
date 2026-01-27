[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:52](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L52)

RedGPU의 모든 GPU 리소스를 통합 관리하는 핵심 클래스입니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// RedGPUContext를 통해 접근합니다.
const resourceManager = redGPUContext.resourceManager;
```

## Constructors

### Constructor

> **new ResourceManager**(`redGPUContext`): `ResourceManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:89](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L89)

ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`ResourceManager`

## Properties

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:53](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L53)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:55](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L55)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:54](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L54)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:56](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L56)

## Accessors

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:117](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L117)

기본 샘플러를 반환합니다.


##### Returns

[`Sampler`](../../../classes/Sampler.md)

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:141](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L141)

캐시된 버퍼 상태를 반환합니다.


##### Returns

`any`

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): `DownSampleCubeMapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:133](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L133)

큐브맵 다운샘플링 생성기를 반환합니다.


##### Returns

`DownSampleCubeMapGenerator`

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:149](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L149)

빈 비트맵 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:157](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L157)

빈 큐브 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:109](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L109)

GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:165](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L165)

비트맵 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:173](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L173)

큐브 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:181](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L181)

HDR 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:205](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L205)

인덱스 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:213](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L213)

Storage 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:189](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L189)

유니폼 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:197](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L197)

버텍스 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): `MipmapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L125)

밉맵 생성기를 반환합니다.


##### Returns

`MipmapGenerator`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:101](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L101)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

***

### resources

#### Get Signature

> **get** **resources**(): `ImmutableKeyMap`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:221](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L221)

내부 리소스 맵을 반환합니다.


##### Returns

`ImmutableKeyMap`

## Methods

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:429](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L429)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:496](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L496)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:475](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L475)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:385](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L385)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:274](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L274)

GPU 텍스처를 생성하고 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | 텍스처 디스크립터

#### Returns

`GPUTexture`

생성된 GPUTexture


***

### deleteGPUBindGroupLayout()

> **deleteGPUBindGroupLayout**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:458](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L458)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:412](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L412)

GPUShaderModule을 삭제합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름

#### Returns

`void`

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:447](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L447)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:297](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L297)

비트맵 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` \| [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`PackedTexture`](../../../classes/PackedTexture.md) | 대상 텍스처 (BitmapTexture, PackedTexture 또는 GPUTexture)
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택)

#### Returns

`GPUTextureView`

GPUTextureView


***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:341](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L341)

큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `GPUTexture` \| `IBLCubeTexture` \| [`CubeTexture`](../../../classes/CubeTexture.md) | 대상 큐브 텍스처 (CubeTexture, IBLCubeTexture 또는 GPUTexture)
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택)

#### Returns

`GPUTextureView`

GPUTextureView


***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:401](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L401)

캐싱된 GPUShaderModule을 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 셰이더 모듈 이름

#### Returns

`GPUShaderModule`

GPUShaderModule


***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:235](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L235)

리소스를 관리 대상으로 등록합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 대상 리소스
| `resourceState` | `ResourceState` | 리소스 상태 정보

#### Returns

`void`

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:253](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/resourceManager/ResourceManager.ts#L253)

리소스를 관리 대상에서 해제합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 대상 리소스

#### Returns

`void`
