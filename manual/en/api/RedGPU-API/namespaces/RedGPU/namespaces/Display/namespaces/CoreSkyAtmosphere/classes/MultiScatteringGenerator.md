[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / MultiScatteringGenerator

# Class: MultiScatteringGenerator

Defined in: [src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts#L21)

Generator for the 2D LUT that computes and stores multi-scattering energy between atmospheric particles.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md)

## Constructors



***

### Constructor

> **new MultiScatteringGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`): `MultiScatteringGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts#L40)

Creates a MultiScatteringGenerator instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | Shared uniform buffer for atmospheric parameters |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler for LUT sampling |

#### Returns

`MultiScatteringGenerator`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`constructor`](ASkyAtmosphereLUTGenerator.md#constructor)

## Accessors



***

### lutTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lutTexture**(): [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts#L53)

Returns the generated Multi-Scattering LUT texture.

##### Returns

[`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

DirectTexture instance

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`lutTexture`](ASkyAtmosphereLUTGenerator.md#luttexture)

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts#L81)

Releases the generator and internal resources.

#### Returns

`void`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`destroy`](ASkyAtmosphereLUTGenerator.md#destroy)

***

***

### render()

> **render**(`transmittance`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/multiScattering/MultiScatteringGenerator.ts#L65)

Computes the multi-scattering LUT based on the transmittance LUT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `transmittance` | [`DirectTexture`](../../../../Resource/classes/DirectTexture.md) | Transmittance LUT texture |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`antialiasingManager`](ASkyAtmosphereLUTGenerator.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`commandEncoderManager`](ASkyAtmosphereLUTGenerator.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`gpuDevice`](ASkyAtmosphereLUTGenerator.md#gpudevice)

***

***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L115)

Returns the height of the LUT texture.

##### Returns

`number`

Texture height

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`height`](ASkyAtmosphereLUTGenerator.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`instanceId`](ASkyAtmosphereLUTGenerator.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`name`](ASkyAtmosphereLUTGenerator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`redGPUContext`](ASkyAtmosphereLUTGenerator.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`resourceManager`](ASkyAtmosphereLUTGenerator.md#resourcemanager)

***

***

### sampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L91)

Returns the sampler for LUT sampling.

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

Sampler instance

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sampler`](ASkyAtmosphereLUTGenerator.md#sampler)

***

***

### sharedUniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L79)

Returns the shared uniform buffer for atmospheric parameters.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Shared uniform buffer

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sharedUniformBuffer`](ASkyAtmosphereLUTGenerator.md#shareduniformbuffer)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`uuid`](ASkyAtmosphereLUTGenerator.md#uuid)

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L103)

Returns the width of the LUT texture.

##### Returns

`number`

Texture width

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`width`](ASkyAtmosphereLUTGenerator.md#width)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### createBindGroup()

> **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:254](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L254)

Creates a bind group based on the first layout of the compute pipeline.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Bind group label |
| `pipeline` | `GPUComputePipeline` | Reference compute pipeline |
| `entries` | `GPUBindGroupEntry`[] | Array of bind group entries |

#### Returns

`GPUBindGroup`

Created GPUBindGroup

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createBindGroup`](ASkyAtmosphereLUTGenerator.md#createbindgroup)

***

***

### createComputePipeline()

> **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L225)

Creates a compute pipeline from WGSL shader code.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Pipeline label |
| `shaderCode` | `string` | WGSL shader source code |

#### Returns

`GPUComputePipeline`

Created GPUComputePipeline

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createComputePipeline`](ASkyAtmosphereLUTGenerator.md#createcomputepipeline)

***

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L187)

Creates a GPU texture for storing the LUT.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `is3D?` | `boolean` | `false` | Whether to create a 3D texture (default: false) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | Texture format (default: `'rgba16float'`) |

#### Returns

`GPUTexture`

Created GPUTexture

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createLUTTexture`](ASkyAtmosphereLUTGenerator.md#createluttexture)

***

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSizeX?`, `workgroupSizeY?`, `workgroupSizeZ?`, `notifyUpdate?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:152](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L152)

Executes a compute pass to update the LUT data.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pipeline` | `GPUComputePipeline` | `undefined` | Compute pipeline to execute |
| `bindGroup` | `GPUBindGroup` | `undefined` | Resource bind group to bind |
| `workgroupSizeX?` | `number` | `8` | X-axis workgroup size (default: 8) |
| `workgroupSizeY?` | `number` | `8` | Y-axis workgroup size (default: 8) |
| `workgroupSizeZ?` | `number` | `1` | Z-axis workgroup size (default: 1) |
| `notifyUpdate?` | `boolean` | `true` | Whether to automatically call `lutTexture.notifyUpdate()` after pass execution (default: true) |

#### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`executeComputePass`](ASkyAtmosphereLUTGenerator.md#executecomputepass)

***

</details>
