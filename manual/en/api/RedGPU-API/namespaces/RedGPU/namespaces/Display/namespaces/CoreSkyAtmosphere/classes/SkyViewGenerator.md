[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / SkyViewGenerator

# Class: SkyViewGenerator

Defined in: [src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts#L21)

SkyViewGenerator creates the Sky View LUT.

Precomputes the scattered light intensity for all directions of the sky based on the current camera position and stores it in a 2D texture. This enables high-speed sky rendering without complex physical calculations during background rendering.

## Extends

- [`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md)

## Constructors

### Constructor

> **new SkyViewGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`): `SkyViewGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts:26](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts#L26)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) |

#### Returns

`SkyViewGenerator`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`constructor`](ASkyAtmosphereLUTGenerator.md#constructor)

## Properties

### lutTexture

#### Get Signature

> **get** **lutTexture**(): [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts:31](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts#L31)

##### Returns

[`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`lutTexture`](ASkyAtmosphereLUTGenerator.md#luttexture)

***

### render()

> **render**(`transmittance`, `multiScat`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/skyView/SkyViewGenerator.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `transmittance` | [`DirectTexture`](../../../../Resource/classes/DirectTexture.md) |
| `multiScat` | [`DirectTexture`](../../../../Resource/classes/DirectTexture.md) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`instanceId`](ASkyAtmosphereLUTGenerator.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`antialiasingManager`](ASkyAtmosphereLUTGenerator.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`commandEncoderManager`](ASkyAtmosphereLUTGenerator.md#commandencodermanager)

***

### depth

#### Get Signature

> **get** **depth**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:60](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L60)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`depth`](ASkyAtmosphereLUTGenerator.md#depth)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`gpuDevice`](ASkyAtmosphereLUTGenerator.md#gpudevice)

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:56](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L56)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`height`](ASkyAtmosphereLUTGenerator.md#height)

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:48](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L48)

##### Returns

`string`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`label`](ASkyAtmosphereLUTGenerator.md#label)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`name`](ASkyAtmosphereLUTGenerator.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`redGPUContext`](ASkyAtmosphereLUTGenerator.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`resourceManager`](ASkyAtmosphereLUTGenerator.md#resourcemanager)

***

### sampler

#### Get Signature

> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:44](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L44)

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sampler`](ASkyAtmosphereLUTGenerator.md#sampler)

***

### sharedUniformBuffer

#### Get Signature

> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L40)

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sharedUniformBuffer`](ASkyAtmosphereLUTGenerator.md#shareduniformbuffer)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`uuid`](ASkyAtmosphereLUTGenerator.md#uuid)

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:52](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L52)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`width`](ASkyAtmosphereLUTGenerator.md#width)

## Methods

### createBindGroup()

> `protected` **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:107](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `pipeline` | `GPUComputePipeline` |
| `entries` | `GPUBindGroupEntry`[] |

#### Returns

`GPUBindGroup`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createBindGroup`](ASkyAtmosphereLUTGenerator.md#createbindgroup)

***

### createComputePipeline()

> `protected` **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:95](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `shaderCode` | `string` |

#### Returns

`GPUComputePipeline`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createComputePipeline`](ASkyAtmosphereLUTGenerator.md#createcomputepipeline)

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L84)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `is3D` | `boolean` | `false` |
| `format` | `GPUTextureFormat` | `'rgba16float'` |

#### Returns

`GPUTexture`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createLUTTexture`](ASkyAtmosphereLUTGenerator.md#createluttexture)

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSize?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pipeline` | `GPUComputePipeline` |
| `bindGroup` | `GPUBindGroup` |
| `workgroupSize` | \[`number`, `number`, `number`\] |

#### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`executeComputePass`](ASkyAtmosphereLUTGenerator.md#executecomputepass)

***


</details>
