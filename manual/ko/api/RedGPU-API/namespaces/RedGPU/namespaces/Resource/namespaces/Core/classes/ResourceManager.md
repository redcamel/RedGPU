[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:58](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L58)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:99](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L99)

ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`ResourceManager`

## Properties

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L59)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:61](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L61)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:60](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L60)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:62](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L62)

## Accessors

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:131](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L131)

기본 샘플러를 반환합니다.


##### Returns

[`Sampler`](../../../classes/Sampler.md)

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:139](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L139)

BRDF 생성기를 반환합니다.


##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:187](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L187)

캐시된 버퍼 상태를 반환합니다.


##### Returns

`any`

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): `DownSampleCubeMapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:179](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L179)

큐브맵 다운샘플링 생성기를 반환합니다.


##### Returns

`DownSampleCubeMapGenerator`

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:195](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L195)

빈 비트맵 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:203](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L203)

빈 큐브 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:163](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L163)

Equirectangular(2D)를 CubeMap으로 변환하는 생성기를 반환합니다.


##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:123](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L123)

GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:147](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L147)

Irradiance 생성기를 반환합니다.


##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:211](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L211)

비트맵 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:219](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L219)

큐브 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:227](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L227)

HDR 텍스처 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:251](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L251)

인덱스 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:259](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L259)

Storage 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:235](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L235)

유니폼 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:243](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L243)

버텍스 버퍼 관리 상태를 반환합니다.


##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): `MipmapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:171](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L171)

밉맵 생성기를 반환합니다.


##### Returns

`MipmapGenerator`

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:155](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L155)

Prefilter 생성기를 반환합니다.


##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:115](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L115)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

***

### resources

#### Get Signature

> **get** **resources**(): `ImmutableKeyMap`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:267](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L267)

내부 리소스 맵을 반환합니다.


##### Returns

`ImmutableKeyMap`

## Methods

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:475](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L475)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:542](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L542)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:521](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L521)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:431](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L431)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:320](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L320)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:504](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L504)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:458](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L458)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:493](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L493)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:343](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L343)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:387](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L387)

큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `GPUTexture` \| [`IBLCubeTexture`](../../CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../../classes/CubeTexture.md) | 대상 큐브 텍스처 (CubeTexture, IBLCubeTexture 또는 GPUTexture)
| `viewDescriptor?` | `GPUTextureViewDescriptor` | 뷰 디스크립터 (선택)

#### Returns

`GPUTextureView`

GPUTextureView


***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:447](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L447)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:281](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L281)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:299](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/resourceManager/ResourceManager.ts#L299)

리소스를 관리 대상에서 해제합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | 대상 리소스

#### Returns

`void`
