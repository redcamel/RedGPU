[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / ASkyAtmosphereLUTGenerator

# Abstract Class: ASkyAtmosphereLUTGenerator

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:15](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L15)

ASkyAtmosphereLUTGenerator is an abstract base class for creating atmospheric scattering LUTs (Look Up Tables).

Provides common logic for baking physical calculation results into textures using compute shaders.

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`TransmittanceGenerator`](TransmittanceGenerator.md)
- [`SkyViewGenerator`](SkyViewGenerator.md)
- [`MultiScatteringGenerator`](MultiScatteringGenerator.md)
- [`AerialPerspectiveGenerator`](AerialPerspectiveGenerator.md)

## Constructors

### Constructor

> `protected` **new ASkyAtmosphereLUTGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`, `label`, `width`, `height`, `depth?`): `ASkyAtmosphereLUTGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:23](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L23)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | `undefined` |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | `undefined` |
| `label` | `string` | `undefined` |
| `width` | `number` | `undefined` |
| `height` | `number` | `undefined` |
| `depth` | `number` | `1` |

#### Returns

`ASkyAtmosphereLUTGenerator`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### depth

#### Get Signature

> **get** **depth**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:60](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L60)

##### Returns

`number`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:56](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L56)

##### Returns

`number`

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:48](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L48)

##### Returns

`string`

***

### lutTexture

#### Get Signature

> **get** `abstract` **lutTexture**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L64)

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

***

### sampler

#### Get Signature

> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:44](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L44)

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

***

### sharedUniformBuffer

#### Get Signature

> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L40)

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L52)

##### Returns

`number`

## Methods

### createBindGroup()

> `protected` **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:107](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `pipeline` | `GPUComputePipeline` |
| `entries` | `GPUBindGroupEntry`[] |

#### Returns

`GPUBindGroup`

***

### createComputePipeline()

> `protected` **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:95](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `shaderCode` | `string` |

#### Returns

`GPUComputePipeline`

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L84)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `is3D` | `boolean` | `false` |
| `format` | `GPUTextureFormat` | `'rgba16float'` |

#### Returns

`GPUTexture`

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSize?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pipeline` | `GPUComputePipeline` |
| `bindGroup` | `GPUBindGroup` |
| `workgroupSize` | \[`number`, `number`, `number`\] |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
