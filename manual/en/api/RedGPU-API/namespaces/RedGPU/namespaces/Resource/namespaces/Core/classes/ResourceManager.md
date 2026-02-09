[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:58](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L58)


The core class that integrates and manages all GPU resources in RedGPU.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// RedGPUContext를 통해 접근합니다.
const resourceManager = redGPUContext.resourceManager;
```

## Constructors

### Constructor

> **new ResourceManager**(`redGPUContext`): `ResourceManager`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:99](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L99)


Creates a ResourceManager instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ResourceManager`

## Properties

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L59)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:61](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L61)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L60)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:62](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L62)

## Accessors

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:131](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L131)


Returns the basic sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:139](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L139)


Returns the BRDF generator.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:187](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L187)


Returns the cached buffer state.

##### Returns

`any`

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): `DownSampleCubeMapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:179](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L179)


Returns the down-sample cube map generator.

##### Returns

`DownSampleCubeMapGenerator`

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:195](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L195)


Returns the empty bitmap texture view.

##### Returns

`GPUTextureView`

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:203](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L203)


Returns the empty cube texture view.

##### Returns

`GPUTextureView`

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:163](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L163)


Returns the generator that converts Equirectangular (2D) to CubeMap.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:123](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L123)


Returns the GPU device.

##### Returns

`GPUDevice`

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:147](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L147)


Returns the Irradiance generator.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:211](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L211)


Returns the managed bitmap texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:219](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L219)


Returns the managed cube texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:227](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L227)


Returns the managed HDR texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:251](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L251)


Returns the managed index buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:259](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L259)


Returns the managed storage buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:235](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L235)


Returns the managed uniform buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:243](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L243)


Returns the managed vertex buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): `MipmapGenerator`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:171](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L171)


Returns the mipmap generator.

##### Returns

`MipmapGenerator`

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:155](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L155)


Returns the Prefilter generator.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:115](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L115)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

***

### resources

#### Get Signature

> **get** **resources**(): `ImmutableKeyMap`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:267](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L267)


Returns the internal resource map.

##### Returns

`ImmutableKeyMap`

## Methods

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:475](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L475)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:542](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L542)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:521](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L521)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:431](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L431)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:320](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L320)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:504](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L504)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:458](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L458)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:493](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L493)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:343](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L343)


Retrieves or creates a view for a bitmap texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` \| [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`PackedTexture`](../../../classes/PackedTexture.md) | Target texture (BitmapTexture, PackedTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`


GPUTextureView

***

### getGPUResourceCubeTextureView()

> **getGPUResourceCubeTextureView**(`cubeTexture`, `viewDescriptor?`): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:387](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L387)


Retrieves or creates a view for a cube texture from cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | `GPUTexture` \| [`IBLCubeTexture`](../../CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../../classes/CubeTexture.md) | Target cube texture (CubeTexture, IBLCubeTexture, or GPUTexture) |
| `viewDescriptor?` | `GPUTextureViewDescriptor` | View descriptor (optional) |

#### Returns

`GPUTextureView`


GPUTextureView

***

### getGPUShaderModule()

> **getGPUShaderModule**(`name`): `GPUShaderModule`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:447](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L447)


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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:281](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L281)


Registers a resource for management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource |
| `resourceState` | `ResourceState` | Resource state information |

#### Returns

`void`

***

### unregisterManagementResource()

> **unregisterManagementResource**(`target`): `void`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:299](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/resourceManager/ResourceManager.ts#L299)


Unregisters a resource from management.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`ManagementResourceBase`](ManagementResourceBase.md) | Target resource |

#### Returns

`void`
