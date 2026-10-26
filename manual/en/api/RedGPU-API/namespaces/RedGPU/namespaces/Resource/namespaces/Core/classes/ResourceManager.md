[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L87)

Class that integrates and manages all GPU resources in RedGPU.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via RedGPUContext.
const resourceManager = redGPUContext.resourceManager;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new ResourceManager**(`redGPUContext`): `ResourceManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L170)

Creates a ResourceManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ResourceManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L102)

Global vertex bind group layout preset key

***

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:97](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L97)

Instancing global vertex bind group layout preset key

***

***

### PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_GLOBAL\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L112)

Skinning global vertex bind group layout preset key

***

***

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L92)

System common bind group layout preset key

***

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:107](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L107)

Vertex bind group layout preset key

## Accessors



***

### basicDisplacementSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicDisplacementSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L309)

Returns the basic displacement sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Displacement Sampler instance

***

***

### basicSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:297](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L297)

Returns the basic sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Basic Sampler instance

***

***

### brdfGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:321](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L321)

Returns the BRDF generator.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator instance

***

***

### cachedBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:417](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L417)

Returns the cached buffer state object.

##### Returns

`any`

Cached buffer state object

***

***

### downSampleCubeMapGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:405](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L405)

Returns the down-sample cube map generator.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator instance

***

***

### emptyBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBindGroup**(): `GPUBindGroup`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:519](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L519)

Returns the global empty bind group (`entries: []`).

##### Returns

`GPUBindGroup`

Empty GPUBindGroup instance

***

***

### emptyBindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:501](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L501)

Returns the global empty bind group layout (`entries: []`).

##### Returns

`GPUBindGroupLayout`

Empty GPUBindGroupLayout instance

***

***

### emptyBitmapTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:429](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L429)

Returns the empty bitmap texture view.

##### Returns

`GPUTextureView`

Empty bitmap GPUTextureView

***

***

### emptyCubeTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:453](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L453)

Returns the empty cube texture view.

##### Returns

`GPUTextureView`

Empty cube GPUTextureView

***

***

### emptyDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:477](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L477)

Returns the empty depth texture view.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

***

### emptyR32FloatTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyR32FloatTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:489](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L489)

Returns the empty 1x1 R32Float texture view.

##### Returns

`GPUTextureView`

Empty R32Float GPUTextureView

***

***

### emptyTexture2DArrayView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyTexture2DArrayView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:441](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L441)

Returns the empty 2D texture array view.

##### Returns

`GPUTextureView`

Empty 2D array GPUTextureView

***

***

### emptyTexture3DView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:465](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L465)

Returns the empty 3D texture view.

##### Returns

`GPUTextureView`

Empty 3D GPUTextureView

***

***

### equirectangularToCubeGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L357)

Returns the generator that converts Equirectangular (2D) to CubeMap.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator instance

***

***

### GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_FRAGMENT\_STRUCT\_BUILT\_IN**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L213)

Returns the built-in global fragment struct format information.

##### Returns

`any`

Built-in global fragment struct format information

***

***

### GLOBAL\_FRAGMENT\_STRUCT\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_FRAGMENT\_STRUCT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L201)

Returns the PBR global fragment struct format information.

##### Returns

`any`

PBR global fragment struct format information

***

***

### GLOBAL\_VERTEX\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **GLOBAL\_VERTEX\_STRUCT**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L225)

Returns the global vertex struct format information.

##### Returns

`any`

Global vertex struct format information

***

***

### gltfCacheManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gltfCacheManager**(): `GLTFCacheManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:381](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L381)

Returns the GLTF cache manager.

##### Returns

`GLTFCacheManager`

GLTFCacheManager instance

***

***

### irradianceGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L333)

Returns the Irradiance generator.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator instance

***

***

### managedBitmapTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:538](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L538)

Returns the managed bitmap texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed bitmap texture status info object

***

***

### managedCubeTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:562](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L562)

Returns the managed cube texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed cube texture status info object

***

***

### managedHDRTextureState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:574](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L574)

Returns the managed HDR texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed HDR texture status info object

***

***

### managedIndexBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:610](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L610)

Returns the managed index buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed index buffer status info object

***

***

### managedStorageBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:622](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L622)

Returns the managed storage buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed storage buffer status info object

***

***

### managedTextureArrayState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedTextureArrayState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:550](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L550)

Returns the managed texture array state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed texture array status info object

***

***

### managedUniformBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:586](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L586)

Returns the managed uniform buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed uniform buffer status info object

***

***

### managedVertexBufferState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L598)

Returns the managed vertex buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed vertex buffer status info object

***

***

### mipmapGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:393](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L393)

Returns the mipmap generator.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator instance

***

***

### packedTextureManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedTextureManager**(): `PackedTextureManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L369)

Returns the packed texture manager.

##### Returns

`PackedTextureManager`

PackedTextureManager instance

***

***

### prefilterGenerator

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:345](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L345)

Returns the Prefilter generator.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator instance

***

***

### resources

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:634](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L634)

Returns the internal resource map.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

`ImmutableKeyMap` based resource map

***

***

### SHADER\_INFO\_BASIC

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_BASIC**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L249)

Returns the basic mesh shader parsing information.

##### Returns

`any`

Basic mesh shader information

***

***

### SHADER\_INFO\_ONLY\_FRAGMENT\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_ONLY\_FRAGMENT\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:261](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L261)

Returns the fragment-only PBR mesh shader parsing information.

##### Returns

`any`

Fragment-only PBR mesh shader information

***

***

### SHADER\_INFO\_ONLY\_VERTEX\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_ONLY\_VERTEX\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:273](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L273)

Returns the vertex-only PBR mesh shader parsing information.

##### Returns

`any`

Vertex-only PBR mesh shader information

***

***

### SHADER\_INFO\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO\_PBR**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L237)

Returns the PBR mesh shader parsing information.

##### Returns

`any`

PBR mesh shader information

***

***

### wgslParser

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **wgslParser**(): `WGSLParser`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:285](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L285)

Returns the WGSL parser instance.

##### Returns

`WGSLParser`

WGSLParser instance

## Methods



***

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1016](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1016)

Creates and caches a GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |
| `bindGroupLayoutDescriptor` | `GPUBindGroupLayoutDescriptor` | Bind group layout descriptor |

#### Returns

`GPUBindGroupLayout`

Created GPUBindGroupLayout

***

***

### createGPUBuffer()

> **createGPUBuffer**(`name`, `gpuBufferDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1087](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1087)

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

***

### createGPUPipelineLayout()

> **createGPUPipelineLayout**(`name`, `gpuPipelineLayoutDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1065](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1065)

Creates and caches a GPUPipelineLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Pipeline layout name |
| `gpuPipelineLayoutDescriptor` | `GPUPipelineLayoutDescriptor` | Pipeline layout descriptor |

#### Returns

`any`

Created GPUPipelineLayout

***

***

### createGPUShaderModule()

> **createGPUShaderModule**(`name`, `gpuShaderModuleDescriptor`): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:969](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L969)

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

***

### createManagedTexture()

> **createManagedTexture**(`desc`): `GPUTexture`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:841](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L841)

Creates a managed GPU texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `desc` | `GPUTextureDescriptor` | Texture descriptor |

#### Returns

`GPUTexture`

Created GPUTexture instance

***

***

### createSampler()

> **createSampler**(`descriptorKey`, `samplerOptions`): `GPUSampler`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:652](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L652)

Retrieves a sampler from cache, or creates and returns a new one if it does not exist.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `descriptorKey` | `string` | Sampler descriptor cache key |
| `samplerOptions` | `GPUSamplerDescriptor` | GPUSamplerDescriptor options object |

#### Returns

`GPUSampler`

Cached or newly created GPUSampler

***

***

### deleteGPUBindGroupLayout()

> **deleteGPUBindGroupLayout**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1047](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1047)

Deletes a cached GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |

#### Returns

`void`

***

***

### deleteGPUShaderModule()

> **deleteGPUShaderModule**(`name`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:998](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L998)

Deletes a cached GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:705](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L705)

Destroys the ResourceManager instance and releases all cached WebGPU resources.

#### Returns

`void`

***

***

### getGPUBindGroupLayout()

> **getGPUBindGroupLayout**(`name`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1035](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1035)

Returns the cached GPUBindGroupLayout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layout name |

#### Returns

`GPUBindGroupLayout`

Cached GPUBindGroupLayout

***

***

### getGPUResourceBitmapTextureView()

> **getGPUResourceBitmapTextureView**(`texture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:865](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L865)

Retrieves or creates a view for a bitmap texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `any` | Target texture (BitmapTexture, PackedTexture, DirectTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`

GPUTextureView instance or null

***

***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:925](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L925)

Retrieves or creates a view for a cube texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `any` | Target cube texture (CubeTexture, DirectCubeTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`

GPUTextureView instance or null

***

***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:986](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L986)

Returns the cached GPUShaderModule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Shader module name |

#### Returns

`GPUShaderModule`

Cached GPUShaderModule

***

***

### initPresets()

> **initPresets**(): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1099](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1099)

Initializes system preset resources.

#### Returns

`void`

***

***

### registerManagementResource()

> **registerManagementResource**(`target`, `resourceState`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:671](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L671)

Registers a resource for management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource to register |
| `resourceState` | [`ResourceState`](../type-aliases/ResourceState.md) | Resource state information |

#### Returns

`void`

***

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:690](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L690)

Unregisters a resource from management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource to unregister |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): `ResourceManager`

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

`ResourceManager`

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
