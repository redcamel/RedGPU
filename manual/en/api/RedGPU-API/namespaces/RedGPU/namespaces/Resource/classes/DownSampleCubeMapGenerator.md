[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DownSampleCubeMapGenerator

# Class: DownSampleCubeMapGenerator

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:11](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L11)

Generator class responsible for cubemap downsampling and mipmap generation.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new DownSampleCubeMapGenerator**(`redGPUContext`): `DownSampleCubeMapGenerator`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:22](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`DownSampleCubeMapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### createBindGroup()

> **createBindGroup**(`bindGroupLayout`, `sourceView`, `targetView`, `uniformBuffer`): `GPUBindGroup`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L58)

Create bind group (cached)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bindGroupLayout` | `GPUBindGroupLayout` |
| `sourceView` | `GPUTextureView` |
| `targetView` | `GPUTextureView` |
| `uniformBuffer` | `GPUBuffer` |

#### Returns

`GPUBindGroup`

***

### createSourceTextureView()

> **createSourceTextureView**(`sourceCubemap`, `sourceMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:27](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L27)

Create source texture view (cached)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sourceCubemap` | `GPUTexture` |
| `sourceMipLevel` | `number` |

#### Returns

`GPUTextureView`

***

### createTargetTextureView()

> **createTargetTextureView**(`targetCubemap`, `targetMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:42](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L42)

Create target texture view (cached)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetCubemap` | `GPUTexture` |
| `targetMipLevel` | `number` |

#### Returns

`GPUTextureView`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:131](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L131)

Clears all resources.

#### Returns

`void`

***

### downsampleCubemap()

> **downsampleCubemap**(`sourceCubemap`, `targetSize?`, `format?`): `Promise`\<`GPUTexture`\>

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:91](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L91)

Performs cubemap downsampling.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | `undefined` | Source cubemap texture |
| `targetSize` | `number` | `256` | Target size |
| `format` | `GPUTextureFormat` | `'rgba16float'` | Texture format |

#### Returns

`Promise`\<`GPUTexture`\>

Downsampled cubemap


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
