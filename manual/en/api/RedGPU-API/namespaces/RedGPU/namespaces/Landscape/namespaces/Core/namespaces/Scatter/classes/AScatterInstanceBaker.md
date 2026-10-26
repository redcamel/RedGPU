[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterInstanceBaker

# Abstract Class: AScatterInstanceBaker

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L50)

Abstract base class that bakes scatter instance transform data on the GPU by referencing terrain heightmaps (VHT), blendmaps (VBT), and layer weight maps.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageInstanceBaker`](../../../../Foliage/namespaces/Core/classes/FoliageInstanceBaker.md)
- [`GrassInstanceBaker`](../../../../Grass/namespaces/Core/classes/GrassInstanceBaker.md)

## Constructors



***

### Constructor

> **new AScatterInstanceBaker**(`redGPUContext`): `AScatterInstanceBaker`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L71)

Initializes an `AScatterInstanceBaker` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`AScatterInstanceBaker`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L95)

Returns the bind group layout of the instance baking shader.

##### Returns

`GPUBindGroupLayout`

Bind group layout (`GPUBindGroupLayout`), or `null` if not initialized

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L83)

Returns the WebGPU compute pipeline for instance baking.

##### Returns

`GPUComputePipeline`

Compute pipeline (`GPUComputePipeline`), or `null` if not initialized

***

***

### defaultSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **defaultSampler**(): `GPUSampler`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L119)

Returns the default GPU sampler used for terrain texture sampling.

##### Returns

`GPUSampler`

Default sampler (`GPUSampler`), or `null` if not initialized

***

***

### uniformGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L107)

Returns the uniform GPU buffer used for uploading baking parameters.

##### Returns

`GPUBuffer`

Uniform buffer (`GPUBuffer`), or `null` if not initialized

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L127)

Destroys the uniform GPU buffer and bind group cache held by the baker.

#### Returns

`void`

***

***

### getOrCreateBindGroup()

> **getOrCreateBindGroup**(`typeId`, `labelPrefix`, `rawBuffer`, `vhtView`, `vbtView`, `weightView`, `tasksBuffer`): `GPUBindGroup`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L166)

Retrieves from cache or creates a new baking GPU bind group corresponding to the type ID and resource combination.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | Scatter type identifier ID |
| `labelPrefix` | `string` | Debug label prefix for the created bind group |
| `rawBuffer` | `GPUBuffer` | Storage buffer to store baked raw instance data |
| `vhtView` | `GPUTextureView` | Virtual Height Texture (VHT) view |
| `vbtView` | `GPUTextureView` | Virtual Blend Texture (VBT) view |
| `weightView` | `GPUTextureView` | Weight map texture view of the target layer |
| `tasksBuffer` | `GPUBuffer` | GPU buffer containing the list of baking tasks |

#### Returns

`GPUBindGroup`

Created or cached `GPUBindGroup`, or `null` if the pipeline is not initialized

***

***

### initComputePipeline()

> **initComputePipeline**(`shaderCode`, `label`, `uniformByteLength?`): `void`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L229)

Initializes the baking compute shader module, bind group layout, pipeline, and uniform buffer.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderCode` | `string` | `undefined` | Baking compute WGSL shader source code |
| `label` | `string` | `undefined` | GPU resource debug label prefix |
| `uniformByteLength?` | `number` | `256` | Byte size of the baking uniform buffer (default: `256`) |

#### Returns

`void`

***

***

### resolveWeightLayer()

> **resolveWeightLayer**(`landscape`, `targetLayer?`): `ResolvedWeightLayerInfo`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L290)

Resolves and returns the weight texture view and channel information based on the target terrain layer name or index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | Target `Landscape` instance holding the layer list |
| `targetLayer?` | `string` \| `number` | Name (`string`) or index (`number`) of the terrain layer to reference |

#### Returns

`ResolvedWeightLayerInfo`

Resolved weight layer information object (`ResolvedWeightLayerInfo`)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
