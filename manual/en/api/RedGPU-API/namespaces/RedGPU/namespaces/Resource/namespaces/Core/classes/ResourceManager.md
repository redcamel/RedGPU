[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:77](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L77)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:134](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L134)

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

Returns the basic displacement sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Displacement Sampler instance

***

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:198](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L198)

Returns the basic sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Basic Sampler instance

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:222](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L222)

Returns the BRDF generator.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator instance

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:310](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L310)

Returns the cached buffer state.

##### Returns

`any`

Cached buffer state object

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:298](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L298)

Returns the down-sample cube map generator.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator instance

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:322](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L322)

Returns the empty bitmap texture view.

##### Returns

`GPUTextureView`

Empty bitmap GPUTextureView

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:334](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L334)

Returns the empty cube texture view.

##### Returns

`GPUTextureView`

Empty cube GPUTextureView

***

### emptyDepthTextureView

#### Get Signature

> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:358](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L358)

Returns the empty depth texture view.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### emptyTexture3DView

#### Get Signature

> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:346](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L346)

Returns the empty 3D texture view.

##### Returns

`GPUTextureView`

Empty 3D GPUTextureView

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:258](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L258)

Returns the generator that converts Equirectangular (2D) to CubeMap.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator instance

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

Returns the GLTF cache manager.

##### Returns

`GLTFCacheManager`

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:234](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L234)

Returns the Irradiance generator.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator instance

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:370](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L370)

Returns the managed bitmap texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed bitmap texture status info object

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:382](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L382)

Returns the managed cube texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed cube texture status info object

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:394](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L394)

Returns the managed HDR texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed HDR texture status info object

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:430](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L430)

Returns the managed index buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed index buffer status info object

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:442](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L442)

Returns the managed storage buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed storage buffer status info object

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:406](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L406)

Returns the managed globalStruct buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed globalStruct buffer status info object

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:418](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L418)

Returns the managed vertex buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed vertex buffer status info object

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:286](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L286)

Returns the mipmap generator.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator instance

***

### packedTextureManager

#### Get Signature

> **get** **packedTextureManager**(): `PackedTextureManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:266](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L266)

Returns the texture packing manager.

##### Returns

`PackedTextureManager`

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:246](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L246)

Returns the Prefilter generator.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator instance

***

### resources

#### Get Signature

> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:454](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L454)

Returns the internal resource map.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

ImmutableKeyMap based resource map

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:862](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L862)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:841](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L841)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:751](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L751)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:641](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L641)

Creates and manages a GPU texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | Texture descriptor |

#### Returns

`GPUTexture`

Created GPUTexture

***

### createSampler()

> **createSampler**(`descriptorKey`, `samplerOptions`): `GPUSampler`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:462](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L462)

Retrieves a sampler from cache, or creates and returns a new one if it does not exist.

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:778](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L778)

Deletes a GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:513](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L513)

Destroys the ResourceManager instance and physically releases all cached WebGPU resources.

#### Returns

`void`

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:813](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L813)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:664](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L664)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:708](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L708)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:767](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L767)

Returns the cached GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`GPUShaderModule`

GPUShaderModule

***

### initPresets()

> **initPresets**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:874](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L874)

Initializes system presets.

#### Returns

`void`

***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:480](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L480)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:498](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/ResourceManager.ts#L498)

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

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
