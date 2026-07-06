[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:73](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L73)

The core class that integrates and manages all GPU resources in RedGPU.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:120](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L120)

Creates a ResourceManager instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ResourceManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN

> `static` **GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN**: `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:81](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L81)

***

### GLOBAL\_FRAGMENT\_STRUCT\_PBR

> `static` **GLOBAL\_FRAGMENT\_STRUCT\_PBR**: `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L80)

***

### GLOBAL\_VERTEX\_STRUCT

> `static` **GLOBAL\_VERTEX\_STRUCT**: `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:79](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L79)

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L76)

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:75](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L75)

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:78](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L78)

***

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:74](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L74)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:77](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L77)

## Accessors

### basicDisplacementSampler

#### Get Signature

> **get** **basicDisplacementSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:152](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L152)

Returns the basic displacement sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Displacement Sampler instance

***

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:140](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L140)

Returns the basic sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Basic Sampler instance

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:164](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L164)

Returns the BRDF generator.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator instance

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:236](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L236)

Returns the cached buffer state.

##### Returns

`any`

Cached buffer state object

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:224](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L224)

Returns the down-sample cube map generator.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator instance

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:248](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L248)

Returns the empty bitmap texture view.

##### Returns

`GPUTextureView`

Empty bitmap GPUTextureView

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:260](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L260)

Returns the empty cube texture view.

##### Returns

`GPUTextureView`

Empty cube GPUTextureView

***

### emptyDepthTextureView

#### Get Signature

> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:284](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L284)

Returns the empty depth texture view.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### emptyTexture3DView

#### Get Signature

> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:272](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L272)

Returns the empty 3D texture view.

##### Returns

`GPUTextureView`

Empty 3D GPUTextureView

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:200](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L200)

Returns the generator that converts Equirectangular (2D) to CubeMap.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator instance

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L176)

Returns the Irradiance generator.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator instance

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:296](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L296)

Returns the managed bitmap texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed bitmap texture status info object

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:308](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L308)

Returns the managed cube texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed cube texture status info object

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:320](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L320)

Returns the managed HDR texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed HDR texture status info object

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:356](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L356)

Returns the managed index buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed index buffer status info object

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:368](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L368)

Returns the managed storage buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed storage buffer status info object

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:332](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L332)

Returns the managed globalStruct buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed globalStruct buffer status info object

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:344](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L344)

Returns the managed vertex buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed vertex buffer status info object

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:212](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L212)

Returns the mipmap generator.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator instance

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:188](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L188)

Returns the Prefilter generator.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator instance

***

### resources

#### Get Signature

> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:380](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L380)

Returns the internal resource map.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

ImmutableKeyMap based resource map

***

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:587](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L587)

Creates and caches a GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |
| `bindGroupLayoutDescriptor` | `GPUBindGroupLayoutDescriptor` | Bind group layout descriptor |

#### Returns

`GPUBindGroupLayout`

GPUBindGroupLayout

***

### createGPUBuffer()

> **createGPUBuffer**(`name`, `gpuBufferDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:654](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L654)

Creates and caches a GPUBuffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Buffer name |
| `gpuBufferDescriptor` | `GPUBufferDescriptor` | Buffer descriptor |

#### Returns

`any`

Created GPUBuffer

***

### createGPUPipelineLayout()

> **createGPUPipelineLayout**(`name`, `gpuPipelineLayoutDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:633](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L633)

Creates and caches a GPUPipelineLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |
| `gpuPipelineLayoutDescriptor` | `GPUPipelineLayoutDescriptor` | Pipeline layout descriptor |

#### Returns

`any`

GPUPipelineLayout

***

### createGPUShaderModule()

> **createGPUShaderModule**(`name`, `gpuShaderModuleDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:543](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L543)

Creates and caches a GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |
| `gpuShaderModuleDescriptor` | `GPUShaderModuleDescriptor` | Shader module descriptor |

#### Returns

`any`

Created GPUShaderModule

***

### createManagedTexture()

> **createManagedTexture**(`desc`): `GPUTexture`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:433](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L433)

Creates and manages a GPU texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | Texture descriptor |

#### Returns

`GPUTexture`

Created GPUTexture

***

### deleteGPUBindGroupLayout()

> **deleteGPUBindGroupLayout**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:616](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L616)

Deletes a GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |

#### Returns

`void`

***

### deleteGPUShaderModule()

> **deleteGPUShaderModule**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:570](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L570)

Deletes a GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`void`

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:605](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L605)

Returns the cached GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |

#### Returns

`GPUBindGroupLayout`

GPUBindGroupLayout

***

### getGPUResourceBitmapTextureView()

> **getGPUResourceBitmapTextureView**(`texture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:456](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L456)

Retrieves or creates a view for a bitmap texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `any` | Target texture (BitmapTexture, PackedTexture, DirectTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`

GPUTextureView

***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:500](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L500)

Retrieves or creates a view for a cube texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `any` | Target cube texture (CubeTexture, DirectCubeTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`

GPUTextureView

***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:559](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L559)

Returns the cached GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`GPUShaderModule`

GPUShaderModule

***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:394](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L394)

Registers a resource for management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource |
| `resourceState` | [`ResourceState`](../type-aliases/ResourceState.md) | Resource state information |

#### Returns

`void`

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:412](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/resourceManager/ResourceManager.ts#L412)

Unregisters a resource from management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): `ResourceManager`

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

`ResourceManager`

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
