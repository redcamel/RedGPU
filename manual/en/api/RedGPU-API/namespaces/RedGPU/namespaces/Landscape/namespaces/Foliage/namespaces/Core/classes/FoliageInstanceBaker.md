[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageInstanceBaker

# Class: FoliageInstanceBaker

Defined in: [src/landscape/foliage/core/baking/FoliageInstanceBaker.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/FoliageInstanceBaker.ts#L40)

Class that bakes foliage instance transforms and attributes for terrain sub-cells into the mega buffer using a compute shader.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md)

## Constructors



***

### Constructor

> **new FoliageInstanceBaker**(`redGPUContext`, `options?`): `FoliageInstanceBaker`

Defined in: [src/landscape/foliage/core/baking/FoliageInstanceBaker.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/FoliageInstanceBaker.ts#L61)

Creates a `FoliageInstanceBaker` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `options?` | `FoliageInstanceBakerOptions` | Baker initialization options (optional) |

#### Returns

`FoliageInstanceBaker`

#### Overrides

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#constructor)

## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/baking/FoliageInstanceBaker.ts:267](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/FoliageInstanceBaker.ts#L267)

Releases the task buffer and GPU resources held by the baker.

#### Returns

`void`

#### Overrides

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#destroy)

***

***

### dispatchBakeSubCell()

> **dispatchBakeSubCell**(`megaBuffer`, `landscape`, `foliage`, `subCell`, `targetSlot`, `targetCount`, `subCellSize`): `void`

Defined in: [src/landscape/foliage/core/baking/FoliageInstanceBaker.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/FoliageInstanceBaker.ts#L103)

Dispatches a procedural instance placement compute pass for a single foliage sub-cell.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `megaBuffer` | [`FoliageMegaBuffer`](FoliageMegaBuffer.md) | `FoliageMegaBuffer` instance where instance data will be written |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | `Landscape` instance providing terrain heightmap and weight maps |
| `foliage` | [`Foliage`](../../../classes/Foliage.md) | Target `Foliage` type instance to bake |
| `subCell` | [`FoliageSubCell`](../interfaces/FoliageSubCell.md) | Target sub-cell information (`FoliageSubCell`) to bake |
| `targetSlot` | `number` | Starting slot offset in the mega buffer for writing |
| `targetCount` | `number` | Maximum number of instances allocated for the sub-cell |
| `subCellSize` | `number` | Side length of the sub-cell in world units |

#### Returns

`void`

***

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#antialiasingmanager)

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L95)

Returns the bind group layout of the instance baking shader.

##### Returns

`GPUBindGroupLayout`

Bind group layout (`GPUBindGroupLayout`), or `null` if not initialized

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`bindGroupLayout`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#bindgrouplayout)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#commandencodermanager)

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`computePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#computepipeline)

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`defaultSampler`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#defaultsampler)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#gpudevice)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#instanceid)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#name)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#redgpucontext)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#resourcemanager)

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`uniformGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#uniformgpubuffer)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`getOrCreateBindGroup`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#getorcreatebindgroup)

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`initComputePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#initcomputepipeline)

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

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`resolveWeightLayer`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#resolveweightlayer)

</details>
