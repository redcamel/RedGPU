[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageRenderer

# Class: FoliageRenderer

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L33)

Renderer class that performs Depth Prepass, main pass, and shadow pass rendering for massive foliage instances using GPU indirect drawing (`drawIndexedIndirect`) and render bundle (`GPURenderBundle`) caching.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md)\<`FoliageMainBundleCacheEntry`\>

## Constructors



***

### Constructor

> **new FoliageRenderer**(`redGPUContext`, `pipelineRegistry`, `renderUnitVertexBindGroupLayout?`, `renderUnitDynamicBindGroup?`): `FoliageRenderer`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L77)

Initializes a `FoliageRenderer` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `pipelineRegistry` | [`FoliagePipelineRegistry`](FoliagePipelineRegistry.md) | Foliage pipeline registry |
| `renderUnitVertexBindGroupLayout?` | `GPUBindGroupLayout` | Render unit vertex bind group layout (optional) |
| `renderUnitDynamicBindGroup?` | `GPUBindGroup` | Shared render unit dynamic bind group (optional) |

#### Returns

`FoliageRenderer`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#constructor)

## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L116)

Cleans up and destroys all caches and internal references held by the renderer.

#### Returns

`void`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#destroy)

***

***

### markAllBundlesDirty()

> **markAllBundlesDirty**(): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L106)

Invalidates all cached render bundles for shadow, Depth Prepass, and main passes.

#### Returns

`void`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markAllBundlesDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markallbundlesdirty)

***

***

### render()

> **render**(`view`, `passEncoder`, `typeList`): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L148)

Renders the active foliage type list into the specified view and render pass encoder (including Depth Prepass).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | Target `View3D` instance to render |
| `passEncoder` | `GPURenderPassEncoder` | Target render pass encoder |
| `typeList` | [`Foliage`](../../../classes/Foliage.md)[] | Array of `Foliage` types to render |

#### Returns

`void`

***

***

### renderShadow()

> **renderShadow**(`view`, `passEncoder`, `typeList`): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L258)

Renders foliage instances into the directional shadow (CSM) pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | Target `View3D` instance to render |
| `passEncoder` | `GPURenderPassEncoder` | Shadow render pass encoder |
| `typeList` | [`Foliage`](../../../classes/Foliage.md)[] | Array of `Foliage` types to render |

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#antialiasingmanager)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#commandencodermanager)

***

***

### dynamicOffsetArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dynamicOffsetArray**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L51)

Returns a reusable 1-element `Uint32Array` to prevent temporary array allocations when binding dynamic uniform offsets.

##### Returns

`Uint32Array`

1-element `Uint32Array` for dynamic uniform offsets

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`dynamicOffsetArray`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#dynamicoffsetarray)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#gpudevice)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#instanceid)

***

***

### mainBundlesByView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainBundlesByView**(): `WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L63)

Returns the `WeakMap<View3D, TMainBundleCache>` managing main render bundle caches keyed by `View3D`.

##### Returns

`WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

Per-view main render bundle cache (`WeakMap<View3D, TMainBundleCache>`)

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`mainBundlesByView`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#mainbundlesbyview)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#name)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#redgpucontext)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#resourcemanager)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### executeSingleBundle()

> **executeSingleBundle**(`passEncoder`, `bundle`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L78)

Executes a single `GPURenderBundle` with Zero-GC by reusing a pre-allocated fixed tuple array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passEncoder` | `GPURenderPassEncoder` | Target render pass encoder on which to execute the bundle |
| `bundle` | `GPURenderBundle` | `GPURenderBundle` instance to execute |

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`executeSingleBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#executesinglebundle)

***

***

### getShadowBundle()

> **getShadowBundle**(`cascadeIndex`): `GPURenderBundle`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L94)

Returns the cached `GPURenderBundle` for the specified shadow cascade index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Shadow cascade index (`0`~`3`) to look up |

#### Returns

`GPURenderBundle`

Cached `GPURenderBundle`, or `null` if none exists

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`getShadowBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#getshadowbundle)

***

***

### isShadowBundleValid()

> **isShadowBundleValid**(`cascadeIndex`, `systemBG`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:133](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L133)

Checks whether the render bundle for the specified shadow cascade is valid and matches the current system bind group.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Shadow cascade index (`0`~`3`) to check |
| `systemBG` | `GPUBindGroup` | Current frame's system uniform bind group |

#### Returns

`boolean`

Whether the cached shadow bundle is valid

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`isShadowBundleValid`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#isshadowbundlevalid)

***

***

### markMainBundleDirty()

> **markMainBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L166)

Invalidates main pass render bundle caches for all views.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markMainBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markmainbundledirty)

***

***

### markShadowBundleDirty()

> **markShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L146)

Invalidates all shadow cascade render bundle caches and invokes the `onShadowBundleDirty` hook.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markShadowBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markshadowbundledirty)

***

***

### onShadowBundleDirty()

> **onShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L159)

Hook method for subclasses to reset additional state when shadow render bundles are invalidated.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`onShadowBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#onshadowbundledirty)

***

***

### setShadowBundle()

> **setShadowBundle**(`cascadeIndex`, `bundle`, `systemBG`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterRenderer.ts#L112)

Caches a `GPURenderBundle` and system bind group reference for the specified shadow cascade index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Target shadow cascade index (`0`~`3`) |
| `bundle` | `GPURenderBundle` | `GPURenderBundle` to store, or `null` |
| `systemBG` | `GPUBindGroup` | System uniform bind group used when recording the bundle |

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`setShadowBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#setshadowbundle)

</details>
