[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageMegaBuffer

# Class: FoliageMegaBuffer

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L39)

Mega buffer class that manages raw instances, main/shadow culled output buffers, indirect draw buffers, and culling uniforms for all foliage types in a unified buffer architecture.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md)

## Constructors



***

### Constructor

> **new FoliageMegaBuffer**(`redGPUContext`, `initialCapacity?`, `maxTypes?`): `FoliageMegaBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L77)

Creates a `FoliageMegaBuffer` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `initialCapacity?` | `number` | `65536` | Initial maximum instance capacity (default: `65536`) |
| `maxTypes?` | `number` | `64` | Maximum number of supported foliage types (default: `64`) |

#### Returns

`FoliageMegaBuffer`

#### Throws

Throws Error if reflecting the `FoliageCullingUniforms` struct size from `foliageCullWGSL` fails

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#constructor)

## Accessors



***

### isReady

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isReady**(): `boolean`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:152](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L152)

Returns whether all internal GPU buffers are properly created and ready for use.

##### Returns

`boolean`

Whether the mega buffer is ready

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`isReady`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#isready)

***

***

### shadowCulledGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowCulledGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L128)

Returns the culled instance GPU buffer for shadow cascades.

##### Returns

`GPUBuffer`

Shadow culled instance `GPUBuffer` or `null`

***

***

### shadowIndirectGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowIndirectGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L140)

Returns the indirect draw GPU buffer for shadow cascades.

##### Returns

`GPUBuffer`

Shadow indirect draw `GPUBuffer` or `null`

***

## Methods



***

### allocateType()

> **allocateType**(`name`, `maxInstances`, `renderUnits`, `shadowMergedRenderUnits?`, `lodInfoList?`): `FoliageTypeAllocation`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L182)

Allocates an instance segment and indirect draw slots for a new foliage type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Unique name of the foliage type |
| `maxInstances` | `number` | Maximum number of instances to allocate |
| `renderUnits` | [`FoliageRenderUnit`](FoliageRenderUnit.md)[] | List of render units for the main pass |
| `shadowMergedRenderUnits?` | [`FoliageRenderUnit`](FoliageRenderUnit.md)[] | List of merged render units for the shadow pass (optional) |
| `lodInfoList?` | [`FoliageLODInfo`](../interfaces/FoliageLODInfo.md)[] | List of metadata per LOD level (optional) |

#### Returns

`FoliageTypeAllocation`

Allocated foliage type segment information (`FoliageTypeAllocation`)

#### Throws

Throws Error if the maximum supported foliage types (`maxTypes`) is exceeded

***

***

### getOrCreateUnifiedCullingBindGroup()

> **getOrCreateUnifiedCullingBindGroup**(`layout`, `hzbTextureView?`, `hzbSampler?`): `GPUBindGroup`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:499](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L499)

Retrieves or creates the `GPUBindGroup` for the unified foliage culling compute pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | `GPUBindGroupLayout` | `GPUBindGroupLayout` of the culling pipeline |
| `hzbTextureView?` | `GPUTextureView` | Hierarchical Z-buffer (HZB) texture view (optional) |
| `hzbSampler?` | `GPUSampler` | HZB sampler (optional) |

#### Returns

`GPUBindGroup`

Created or cached `GPUBindGroup` instance (`null` if buffers are not ready)

***

***

### invalidateUnifiedCullingBindGroup()

> **invalidateUnifiedCullingBindGroup**(): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:556](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L556)

Invalidates the cached unified culling bind group.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`invalidateUnifiedCullingBindGroup`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#invalidateunifiedcullingbindgroup)

***

***

### onDestroy()

> **onDestroy**(): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:669](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L669)

Cleans up shadow and global uniform GPU resources when the mega buffer is destroyed.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onDestroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#ondestroy)

***

***

### onResetMultiIndirectCommands()

> **onResetMultiIndirectCommands**(`commandEncoder`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:693](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L693)

Resets the shadow indirect draw buffer by copying from the reset template buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | `GPUCommandEncoder` instance to use for copying (performs direct queue write if `null`) |

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResetMultiIndirectCommands`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresetmultiindirectcommands)

***

***

### onResizeBuffers()

> **onResizeBuffers**(`newCapacity`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:631](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L631)

Reallocates main and shadow culled output GPU buffers when mega buffer capacity expands.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newCapacity` | `number` | New expanded instance capacity |

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResizeBuffers`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresizebuffers)

***

***

### updateTypeParams()

> **updateTypeParams**(`allocation`, `cullingDistance`, `fadeStartDistance`, `boundingRadius`, `bottomOffset`, `lodInfoList`, `shadowCullDistance?`, `height?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:399](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L399)

Writes culling distance, fade range, bounding dimensions, and LOD transition distances for a specific foliage type into the type parameters buffer.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `allocation` | `FoliageTypeAllocation` | `undefined` | Target foliage type segment allocation info |
| `cullingDistance` | `number` | `undefined` | Maximum culling distance in world units |
| `fadeStartDistance` | `number` | `undefined` | Dither fade-out start distance in world units |
| `boundingRadius` | `number` | `undefined` | Bounding sphere radius in world units |
| `bottomOffset` | `number` | `undefined` | Bottom vertical offset in world units |
| `lodInfoList` | [`FoliageLODInfo`](../interfaces/FoliageLODInfo.md)[] | `undefined` | Array of metadata per LOD level |
| `shadowCullDistance?` | `number` | `300.0` | Maximum shadow culling distance (default: `300.0`) |
| `height?` | `number` | `2.0` | Reference foliage height (default: `2.0`) |

#### Returns

`void`

***

***

### updateUnifiedGlobalUniforms()

> **updateUnifiedGlobalUniforms**(`renderViewStateData`, `fovFactor`, `viewProjectionMatrix?`, `depthBias?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:263](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L263)

Updates the unified global uniform buffer with camera position, frustum planes, shadow cascade data, and per-type instance counts.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | `undefined` | Render view state data for the current frame |
| `fovFactor` | `number` | `undefined` | Camera field-of-view tangent factor (`tan(fov * 0.5)`) |
| `viewProjectionMatrix?` | [`mat4`](../../../../../../Math/type-aliases/mat4.md) | `null` | Combined view-projection matrix (`mat4` or `null`) |
| `depthBias?` | `number` | `0.002` | HZB occlusion test depth bias (default: `0.002`) |

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#antialiasingmanager)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#commandencodermanager)

***

***

### cpuTypeParamsBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L261)

Returns the CPU-side type parameter `Float32Array` buffer.

##### Returns

`Float32Array`

CPU type parameter `Float32Array` buffer

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`cpuTypeParamsBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#cputypeparamsbuffer)

***

***

### cpuTypeParamsUint32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsUint32**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:273](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L273)

Returns the `Uint32Array` view of the CPU-side type parameter buffer.

##### Returns

`Uint32Array`

CPU type parameter `Uint32Array` view

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`cpuTypeParamsUint32`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#cputypeparamsuint32)

***

***

### culledGPUBuffer

#### Get Signature

> **get** **culledGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L309)

Gets or sets the GPU buffer holding culled instance data for the main pass.

##### Returns

`GPUBuffer`

Culled instance `GPUBuffer`, or `null` if unallocated

#### Set Signature

> **set** **culledGPUBuffer**(`buffer`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L313)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `buffer` | `GPUBuffer` |

##### Returns

`void`

#### Inherited from

[`GrassMegaBuffer`](../../../../Grass/namespaces/Core/classes/GrassMegaBuffer.md).[`culledGPUBuffer`](../../../../Grass/namespaces/Core/classes/GrassMegaBuffer.md#culledgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#gpudevice)

***

***

### indirectGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indirectGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:325](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L325)

Returns the GPU buffer holding `drawIndexedIndirect` command arguments for the main pass.

##### Returns

`GPUBuffer`

Indirect draw `GPUBuffer`, or `null` if destroyed

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`indirectGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#indirectgpubuffer)

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceCapacity**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L249)

Returns the currently allocated maximum instance capacity.

##### Returns

`number`

Current maximum instance capacity

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`instanceCapacity`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#instancecapacity)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#instanceid)

***

***

### maxRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxRenderUnits**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L225)

Returns the maximum number of render unit slots supported by the mega buffer.

##### Returns

`number`

Maximum render unit slot count

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`maxRenderUnits`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#maxrenderunits)

***

***

### maxTypes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxTypes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L237)

Returns the maximum number of scatter types supported by the mega buffer.

##### Returns

`number`

Maximum scatter type count

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`maxTypes`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#maxtypes)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#name)

***

***

### onRecreated

#### Get Signature

> **get** **onRecreated**(): () => `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:349](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L349)

Gets or sets the callback function invoked when GPU buffers are recreated due to capacity expansion.

##### Returns

Recreation callback function (`(() => void)`), or `null`

() => `void`

#### Set Signature

> **set** **onRecreated**(`cb`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:353](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L353)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | () => `void` |

##### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onRecreated`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onrecreated)

***

***

### rawGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L297)

Returns the GPU buffer holding baked raw instance data.

##### Returns

`GPUBuffer`

Raw instance `GPUBuffer`, or `null` if destroyed

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`rawGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#rawgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#redgpucontext)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#resourcemanager)

***

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L201)

Returns the stride size in bytes for a single instance data entry.

##### Returns

`number`

Byte stride per instance

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`strideBytes`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#stridebytes)

***

***

### totalAllocatedInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalAllocatedInstances**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:365](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L365)

Returns the total number of raw instances allocated across segments so far.

##### Returns

`number`

Total allocated raw instance count

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`totalAllocatedInstances`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#totalallocatedinstances)

***

***

### totalIndirectDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalIndirectDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:377](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L377)

Returns the total number of indirect draw call slots allocated so far.

##### Returns

`number`

Total allocated indirect draw call slot count

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`totalIndirectDrawCalls`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#totalindirectdrawcalls)

***

***

### typeParamFloats

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **typeParamFloats**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L213)

Returns the number of `Float32` elements for a single type parameter struct.

##### Returns

`number`

Number of `Float32` elements per type parameter struct

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`typeParamFloats`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#typeparamfloats)

***

***

### typeParamsGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **typeParamsGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:337](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L337)

Returns the GPU buffer holding per-type culling parameters.

##### Returns

`GPUBuffer`

Type parameter `GPUBuffer`, or `null` if unused

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`typeParamsGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#typeparamsgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### allocateBaseSegment()

> **allocateBaseSegment**(`typeIdOrName`, `maxInstances`, `renderUnitCount`, `culledMultiplier?`): [`ScatterBaseSegmentAllocation`](../../../../Core/namespaces/Scatter/interfaces/ScatterBaseSegmentAllocation.md)

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:401](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L401)

Allocates raw, culled, and indirect buffer segment regions for a scatter type and returns the allocation info.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `typeIdOrName` | `string` \| `number` | `undefined` | Numeric ID or string name of the scatter type |
| `maxInstances` | `number` | `undefined` | Maximum number of instances requested |
| `renderUnitCount` | `number` | `undefined` | Number of indirect draw slots (render units) to allocate |
| `culledMultiplier?` | `number` | `2` | Culled buffer multiplier relative to raw instances (default: `2`) |

#### Returns

[`ScatterBaseSegmentAllocation`](../../../../Core/namespaces/Scatter/interfaces/ScatterBaseSegmentAllocation.md)

Allocated segment offset and capacity information (`ScatterBaseSegmentAllocation`)

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`allocateBaseSegment`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#allocatebasesegment)

***

***

### clearBaseAllocations()

> **clearBaseAllocations**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L581)

Resets the allocated raw/culled instance counters and indirect draw counter to `0`.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`clearBaseAllocations`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#clearbaseallocations)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:643](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L643)

Destroys all base and derived GPU buffers held by the mega buffer.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#destroy)

***

***

### ensureCapacity()

> **ensureCapacity**(`requiredCapacity`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L598)

Checks the mega buffer size to satisfy the requested instance capacity, expanding and reallocating GPU buffers if insufficient.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requiredCapacity` | `number` | Required total instance capacity |

#### Returns

`boolean`

Whether buffer expansion was actually performed (`true`: reallocated, `false`: kept existing capacity)

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`ensureCapacity`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#ensurecapacity)

***

***

### registerIndirectDrawSlot()

> **registerIndirectDrawSlot**(`slotIndex`, `indexCount`, `firstIndex?`, `baseVertex?`, `firstInstance?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:453](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L453)

Writes the initial template arguments (`indexCount`, `firstIndex`, `baseVertex`, `firstInstance`) for the specified indirect draw slot into the CPU template buffer.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `slotIndex` | `number` | `undefined` | Indirect slot index to write |
| `indexCount` | `number` | `undefined` | Number of indices to draw |
| `firstIndex?` | `number` | `0` | Starting index offset (default: `0`) |
| `baseVertex?` | `number` | `0` | Base vertex offset (default: `0`) |
| `firstInstance?` | `number` | `0` | First instance offset (default: `0`) |

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`registerIndirectDrawSlot`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#registerindirectdrawslot)

***

***

### resetMultiIndirectCommands()

> **resetMultiIndirectCommands**(`commandEncoder?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:539](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L539)

Resets the instance counts of the indirect draw buffer to the template state prior to executing the culling pass each frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder?` | `GPUCommandEncoder` | `GPUCommandEncoder` to record buffer-to-buffer copy commands (uses `queue.writeBuffer` if omitted) |

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`resetMultiIndirectCommands`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#resetmultiindirectcommands)

***

***

### syncIndirectResetTemplateToGPU()

> **syncIndirectResetTemplateToGPU**(`slotIndex?`, `slotCount?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:480](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L480)

Synchronizes the CPU indirect reset template data to the indirect GPU buffer and template GPU buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slotIndex?` | `number` | Starting slot index for partial update (updates all if omitted) |
| `slotCount?` | `number` | Number of slots for partial update (updates all if omitted) |

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`syncIndirectResetTemplateToGPU`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#syncindirectresettemplatetogpu)

***

</details>
