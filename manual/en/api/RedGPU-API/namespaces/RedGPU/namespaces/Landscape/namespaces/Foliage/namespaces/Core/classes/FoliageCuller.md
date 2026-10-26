[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageCuller

# Class: FoliageCuller

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L23)

Class that performs frustum culling, HZB occlusion culling, distance-based LOD selection, and shadow cascade culling for foliage instances via GPU compute shaders.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md)

## Constructors



***

### Constructor

> **new FoliageCuller**(`redGPUContext`, `megaBuffer?`): `FoliageCuller`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L44)

Creates a `FoliageCuller` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `megaBuffer?` | [`FoliageMegaBuffer`](FoliageMegaBuffer.md) | `FoliageMegaBuffer` instance managing unified foliage GPU buffers (optional) |

#### Returns

`FoliageCuller`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#constructor)

## Accessors



***

### baker

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baker**(): [`FoliageInstanceBaker`](FoliageInstanceBaker.md)

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L59)

Returns the foliage instance baker (`FoliageInstanceBaker`) instance.

##### Returns

[`FoliageInstanceBaker`](FoliageInstanceBaker.md)

`FoliageInstanceBaker` instance

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L188)

Releases the culling pipeline, baker, and internal reference resources.

#### Returns

`void`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#destroy)

***

***

### dispatchPass()

> **dispatchPass**(`computePass`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L130)

Records unified foliage culling compute shader dispatch commands into the compute pass encoder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | Target `GPUComputePassEncoder` instance |

#### Returns

`void`

***

***

### recordResetCommands()

> **recordResetCommands**(`encoder`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L116)

Records commands to reset main and shadow indirect draw buffer counters into the encoder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | Target `GPUCommandEncoder` instance |

#### Returns

`void`

***

***

### update()

> **update**(`foliageList`, `renderViewStateData`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L74)

Updates the unified global culling uniform buffer with the current frame's camera view matrix, FOV, HZB texture, and cascade frustum data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliageList` | [`Foliage`](../../../classes/Foliage.md)[] | Array of active `Foliage` types |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | Render view state data for the current frame |

#### Returns

`void`

***

***

### updateAndDispatch()

> **updateAndDispatch**(`foliageList`, `renderViewStateData`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/culling/FoliageCuller.ts#L160)

Updates global culling uniforms and registers indirect buffer reset and culling dispatch in the `CommandEncoderManager` pre-process pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliageList` | [`Foliage`](../../../classes/Foliage.md)[] | Array of active `Foliage` types |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | Render view state data for the current frame |

#### Returns

`void`

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#antialiasingmanager)

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L52)

Returns the bind group layout of the compute culling shader.

##### Returns

`GPUBindGroupLayout`

Bind group layout (`GPUBindGroupLayout`), or `null` if not initialized

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`bindGroupLayout`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#bindgrouplayout)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#commandencodermanager)

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L40)

Returns the created WebGPU compute pipeline.

##### Returns

`GPUComputePipeline`

Compute pipeline (`GPUComputePipeline`), or `null` if not initialized

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`computePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#computepipeline)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#gpudevice)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#instanceid)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#name)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#redgpucontext)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#resourcemanager)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### dispatchCompute()

> **dispatchCompute**(`computePass`, `bindGroup`, `totalInstances`, `workgroupSize?`): `void`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:133](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L133)

Dispatches compute culling workgroups based on the total instance count and workgroup size.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | `undefined` | Target GPU compute pass encoder |
| `bindGroup` | `GPUBindGroup` | `undefined` | Culling GPU bind group to bind |
| `totalInstances` | `number` | `undefined` | Total number of instances to cull |
| `workgroupSize?` | `number` | `64` | Compute shader workgroup size (default: `64`) |

#### Returns

`void`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`dispatchCompute`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#dispatchcompute)

***

***

### initComputePipeline()

> **initComputePipeline**(`shaderName`, `shaderSource`, `labelPrefix`, `entryPoint?`): `void`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L82)

Parses the WGSL compute shader source and initializes the bind group layout and compute pipeline.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderName` | `string` | `undefined` | Shader module identifier name to register in the resource manager |
| `shaderSource` | `string` | `undefined` | WGSL shader source code for compute culling |
| `labelPrefix` | `string` | `undefined` | Debug label prefix for pipeline and layout resources |
| `entryPoint?` | `string` | `'main'` | Compute shader entry point function name (default: `'main'`) |

#### Returns

`void`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`initComputePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#initcomputepipeline)

***

</details>
