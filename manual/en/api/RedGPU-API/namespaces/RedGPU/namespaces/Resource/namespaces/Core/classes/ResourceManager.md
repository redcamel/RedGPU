[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceManager

# Class: ResourceManager

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:66](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L66)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:109](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L109)

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

### PRESET\_GPUBindGroupLayout\_System

> `static` **PRESET\_GPUBindGroupLayout\_System**: `string` = `'PRESET_GPUBindGroupLayout_System'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:67](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L67)

***

### PRESET\_VERTEX\_GPUBindGroupLayout

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:69](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L69)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_Instancing**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_Instancing'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:68](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L68)

***

### PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN

> `static` **PRESET\_VERTEX\_GPUBindGroupLayout\_SKIN**: `string` = `'PRESET_VERTEX_GPUBindGroupLayout_SKIN'`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:70](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L70)

## Accessors

### basicDisplacementSampler

#### Get Signature

> **get** **basicDisplacementSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:141](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L141)

Returns the basic displacement sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Displacement Sampler instance

***

### basicSampler

#### Get Signature

> **get** **basicSampler**(): [`Sampler`](../../../classes/Sampler.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:129](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L129)

Returns the basic sampler.

##### Returns

[`Sampler`](../../../classes/Sampler.md)

Basic Sampler instance

***

### brdfGenerator

#### Get Signature

> **get** **brdfGenerator**(): [`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:153](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L153)

Returns the BRDF generator.

##### Returns

[`BRDFGenerator`](../../CoreIBL/classes/BRDFGenerator.md)

BRDFGenerator instance

***

### cachedBufferState

#### Get Signature

> **get** **cachedBufferState**(): `any`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:225](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L225)

Returns the cached buffer state.

##### Returns

`any`

Cached buffer state object

***

### downSampleCubeMapGenerator

#### Get Signature

> **get** **downSampleCubeMapGenerator**(): [`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:213](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L213)

Returns the down-sample cube map generator.

##### Returns

[`DownSampleCubeMapGenerator`](../../../classes/DownSampleCubeMapGenerator.md)

DownSampleCubeMapGenerator instance

***

### emptyBitmapTextureView

#### Get Signature

> **get** **emptyBitmapTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:237](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L237)

Returns the empty bitmap texture view.

##### Returns

`GPUTextureView`

Empty bitmap GPUTextureView

***

### emptyCubeTextureView

#### Get Signature

> **get** **emptyCubeTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:249](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L249)

Returns the empty cube texture view.

##### Returns

`GPUTextureView`

Empty cube GPUTextureView

***

### emptyDepthTextureView

#### Get Signature

> **get** **emptyDepthTextureView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:273](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L273)

Returns the empty depth texture view.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### emptyTexture3DView

#### Get Signature

> **get** **emptyTexture3DView**(): `GPUTextureView`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:261](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L261)

Returns the empty 3D texture view.

##### Returns

`GPUTextureView`

Empty 3D GPUTextureView

***

### equirectangularToCubeGenerator

#### Get Signature

> **get** **equirectangularToCubeGenerator**(): [`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:189](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L189)

Returns the generator that converts Equirectangular (2D) to CubeMap.

##### Returns

[`EquirectangularToCubeGenerator`](../../CoreIBL/classes/EquirectangularToCubeGenerator.md)

EquirectangularToCubeGenerator instance

***

### irradianceGenerator

#### Get Signature

> **get** **irradianceGenerator**(): [`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:165](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L165)

Returns the Irradiance generator.

##### Returns

[`IrradianceGenerator`](../../CoreIBL/classes/IrradianceGenerator.md)

IrradianceGenerator instance

***

### managedBitmapTextureState

#### Get Signature

> **get** **managedBitmapTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:285](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L285)

Returns the managed bitmap texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed bitmap texture status info object

***

### managedCubeTextureState

#### Get Signature

> **get** **managedCubeTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:297](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L297)

Returns the managed cube texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed cube texture status info object

***

### managedHDRTextureState

#### Get Signature

> **get** **managedHDRTextureState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:309](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L309)

Returns the managed HDR texture state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed HDR texture status info object

***

### managedIndexBufferState

#### Get Signature

> **get** **managedIndexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:345](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L345)

Returns the managed index buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed index buffer status info object

***

### managedStorageBufferState

#### Get Signature

> **get** **managedStorageBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:357](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L357)

Returns the managed storage buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed storage buffer status info object

***

### managedUniformBufferState

#### Get Signature

> **get** **managedUniformBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:321](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L321)

Returns the managed uniform buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed uniform buffer status info object

***

### managedVertexBufferState

#### Get Signature

> **get** **managedVertexBufferState**(): [`ResourceStatusInfo`](ResourceStatusInfo.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:333](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L333)

Returns the managed vertex buffer state.

##### Returns

[`ResourceStatusInfo`](ResourceStatusInfo.md)

Managed vertex buffer status info object

***

### mipmapGenerator

#### Get Signature

> **get** **mipmapGenerator**(): [`MipmapGenerator`](../../../classes/MipmapGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:201](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L201)

Returns the mipmap generator.

##### Returns

[`MipmapGenerator`](../../../classes/MipmapGenerator.md)

MipmapGenerator instance

***

### prefilterGenerator

#### Get Signature

> **get** **prefilterGenerator**(): [`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:177](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L177)

Returns the Prefilter generator.

##### Returns

[`PrefilterGenerator`](../../CoreIBL/classes/PrefilterGenerator.md)

PrefilterGenerator instance

***

### resources

#### Get Signature

> **get** **resources**(): [`ImmutableKeyMap`](ImmutableKeyMap.md)

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:369](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L369)

Returns the internal resource map.

##### Returns

[`ImmutableKeyMap`](ImmutableKeyMap.md)

ImmutableKeyMap based resource map

***

### createBindGroupLayout()

> **createBindGroupLayout**(`name`, `bindGroupLayoutDescriptor`): `GPUBindGroupLayout`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:576](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L576)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:643](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L643)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:622](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L622)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:532](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L532)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:422](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L422)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:605](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L605)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:559](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L559)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:594](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L594)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:445](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L445)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:489](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L489)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:548](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L548)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:383](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L383)

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

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:401](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/resourceManager/ResourceManager.ts#L401)

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

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
