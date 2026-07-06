[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / AMultiPassPostEffect

# Abstract Class: AMultiPassPostEffect

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:15](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L15)

Abstract class for multi-pass post-processing effects.

Base class for chaining and sequentially executing multiple single-pass effects.

## Extends

- [`ASinglePassPostEffect`](ASinglePassPostEffect.md)

## Extended by

- [`Blur`](../../../classes/Blur.md)
- [`GaussianBlur`](../../../classes/GaussianBlur.md)
- [`DOF`](../../../classes/DOF.md)
- [`OldBloom`](../../../classes/OldBloom.md)
- [`Sharpen`](../../../classes/Sharpen.md)

## Constructors

### Constructor

> `protected` **new AMultiPassPostEffect**(`redGPUContext`, `passList`): `AMultiPassPostEffect`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:39](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L39)

Creates an AMultiPassPostEffect instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU Context |
| `passList` | [`ASinglePassPostEffect`](ASinglePassPostEffect.md)[] | Array of single-pass effects to be applied sequentially |

#### Returns

`AMultiPassPostEffect`

#### Overrides

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`constructor`](ASinglePassPostEffect.md#constructor)

## Properties

### passList

#### Get Signature

> **get** **passList**(): [`ASinglePassPostEffect`](ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:65](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L65)

Returns the list of registered internal passes.

##### Returns

[`ASinglePassPostEffect`](ASinglePassPostEffect.md)[]

Array of internal single-pass post effects

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L52)

Returns the sum of video memory usage of all internal passes.

##### Returns

`number`

Video memory usage in bytes

#### Overrides

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`videoMemorySize`](ASinglePassPostEffect.md#videomemorysize)

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:73](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L73)

Clears the resources of all registered internal passes.

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`clear`](ASinglePassPostEffect.md#clear)

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:97](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/AMultiPassPostEffect.ts#L97)

Renders all passes sequentially. The result of each pass is passed as input to the next.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Rendering width |
| `height` | `number` | Rendering height |
| `sourceTextureInfo` | [`IPostEffectResult`](../interfaces/IPostEffectResult.md) | Initial input source texture information |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Rendering result of the final pass

#### Overrides

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`render`](ASinglePassPostEffect.md#render)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`instanceId`](ASinglePassPostEffect.md#instanceid)

***

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:13](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L13)

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`isInstanceofPostEffect`](ASinglePassPostEffect.md#isinstanceofposteffect)

***

### isLdr

> **isLdr**: `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:30](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L30)

Whether the effect operates in LDR (Low Dynamic Range) space

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`isLdr`](ASinglePassPostEffect.md#isldr)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`antialiasingManager`](ASinglePassPostEffect.md#antialiasingmanager)

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

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`commandEncoderManager`](ASinglePassPostEffect.md#commandencodermanager)

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

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`gpuDevice`](ASinglePassPostEffect.md#gpudevice)

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

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`name`](ASinglePassPostEffect.md#name)

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:208](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L208)

Returns the currently allocated output texture view.

##### Returns

`GPUTextureView`

Output GPUTextureView

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`outputTextureView`](ASinglePassPostEffect.md#outputtextureview)

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

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`redGPUContext`](ASinglePassPostEffect.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`resourceManager`](ASinglePassPostEffect.md#resourcemanager)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L124)

Returns shader information based on the current MSAA state.

##### Returns

`any`

WGSL shader analysis info

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`shaderInfo`](ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L112)

Returns storage info from the shader.

##### Returns

`any`

Storage structure information

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`storageInfo`](ASinglePassPostEffect.md#storageinfo)

***

### systemUniformsInfo

#### Get Signature

> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L160)

Returns the system common globalStruct struct information.

##### Returns

`any`

System globalStruct structure info

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`systemUniformsInfo`](ASinglePassPostEffect.md#systemuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L136)

Returns the effect-specific globalStruct buffer.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Uniform buffer instance

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`uniformBuffer`](ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L148)

Returns the effect-specific globalStruct struct information.

##### Returns

`any`

Uniform structure info

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`uniformsInfo`](ASinglePassPostEffect.md#uniformsinfo)

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

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`uuid`](ASinglePassPostEffect.md#uuid)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L172)

Returns the workgroup size X.

##### Returns

`number`

Workgroup size X

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`WORK_SIZE_X`](ASinglePassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L184)

Returns the workgroup size Y.

##### Returns

`number`

Workgroup size Y

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`WORK_SIZE_Y`](ASinglePassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L196)

Returns the workgroup size Z.

##### Returns

`number`

Workgroup size Z

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`WORK_SIZE_Z`](ASinglePassPostEffect.md#work_size_z)

## Methods

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:238](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L238)

Initializes the effect. Creates compute shaders and globalStruct buffers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU Context |
| `name` | `string` | Effect name |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | Compute shader source codes for MSAA and Non-MSAA |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`init`](ASinglePassPostEffect.md#init)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:349](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L349)

Updates a specific globalStruct value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to set |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](ASinglePassPostEffect.md).[`updateUniform`](ASinglePassPostEffect.md#updateuniform)


</details>
