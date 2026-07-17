[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [BaseObject](../README.md) / RedGPUObject

# Abstract Class: RedGPUObject

Defined in: [src/base/RedGPUObject.ts:15](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L15)

Base class for all engine objects using GPU context.

Provides common access paths to RedGPUContext and related managers (ResourceManager, AntialiasingManager, etc.).

## Extends

- [`BaseObject`](BaseObject.md)

## Extended by

- [`GLTFLoader`](../../../classes/GLTFLoader.md)
- [`SimpleCharacterController`](../../Charactor/classes/SimpleCharacterController.md)
- [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)
- [`SkyBox`](../../Display/classes/SkyBox.md)
- [`SkyAtmosphere`](../../Display/classes/SkyAtmosphere.md)
- [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)
- [`PackedTexture`](../../Resource/classes/PackedTexture.md)
- [`DownSampleCubeMapGenerator`](../../Resource/classes/DownSampleCubeMapGenerator.md)
- [`MipmapGenerator`](../../Resource/classes/MipmapGenerator.md)
- [`IBL`](../../Resource/classes/IBL.md)
- [`PickingManager`](../../Picking/classes/PickingManager.md)
- [`AController`](../../Camera/namespaces/Core/classes/AController.md)
- [`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)
- [`RedGPUContextSizeManager`](../../Context/namespaces/Core/classes/RedGPUContextSizeManager.md)
- [`RedGPUContextObserver`](../../Context/namespaces/Core/classes/RedGPUContextObserver.md)
- [`SkyAtmosphereBackground`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyAtmosphereBackground.md)
- [`SkyLight`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyLight.md)
- [`ASkyAtmosphereLUTGenerator`](../../Display/namespaces/CoreSkyAtmosphere/classes/ASkyAtmosphereLUTGenerator.md)
- [`ViewTransform`](../../Display/namespaces/CoreView/classes/ViewTransform.md)
- [`ViewRenderTextureManager`](../../Display/namespaces/CoreView/classes/ViewRenderTextureManager.md)
- [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)
- [`ResourceBase`](../../Resource/namespaces/Core/classes/ResourceBase.md)
- [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)
- [`BRDFGenerator`](../../Resource/namespaces/CoreIBL/classes/BRDFGenerator.md)
- [`IrradianceGenerator`](../../Resource/namespaces/CoreIBL/classes/IrradianceGenerator.md)
- [`PrefilterGenerator`](../../Resource/namespaces/CoreIBL/classes/PrefilterGenerator.md)
- [`EquirectangularToCubeGenerator`](../../Resource/namespaces/CoreIBL/classes/EquirectangularToCubeGenerator.md)
- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)
- [`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md)

## Constructors

### Constructor

> `protected` **new RedGPUObject**(`redGPUContext`): `RedGPUObject`

Defined in: [src/base/RedGPUObject.ts:26](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L26)

RedGPUObject constructor. (Abstract class, cannot be instantiated directly)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance to use |

#### Returns

`RedGPUObject`

#### Overrides

[`BaseObject`](BaseObject.md).[`constructor`](BaseObject.md#constructor)

## Properties

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`BaseObject`](BaseObject.md).[`instanceId`](BaseObject.md#instanceid)

## Accessors

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

[`BaseObject`](BaseObject.md).[`name`](BaseObject.md#name)

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

[`BaseObject`](BaseObject.md).[`uuid`](BaseObject.md#uuid)


</details>
