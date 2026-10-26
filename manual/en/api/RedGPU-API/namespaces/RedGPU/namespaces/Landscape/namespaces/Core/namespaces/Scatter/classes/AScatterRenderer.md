[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterRenderer

# Abstract Class: AScatterRenderer\<TMainBundleCache\>

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L20)

Abstract renderer class responsible for caching and executing `GPURenderBundle` instances for the main pass and shadow cascade passes of the scatter system.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageRenderer`](../../../../Foliage/namespaces/Core/classes/FoliageRenderer.md)
- [`GrassRenderer`](../../../../Grass/namespaces/Core/classes/GrassRenderer.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| <a id="type-parameter-tmainbundlecache"></a> `TMainBundleCache` | `any` | Main pass render bundle cache entry type cached per `View3D` |

## Constructors



***

### Constructor

> **new AScatterRenderer**\<`TMainBundleCache`\>(`redGPUContext`): `AScatterRenderer`\<`TMainBundleCache`\>

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L39)

Initializes an `AScatterRenderer` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`AScatterRenderer`\<`TMainBundleCache`\>

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### dynamicOffsetArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dynamicOffsetArray**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L51)

Returns a reusable 1-element `Uint32Array` to prevent temporary array allocations when binding dynamic uniform offsets.

##### Returns

`Uint32Array`

1-element `Uint32Array` for dynamic uniform offsets

***

***

### mainBundlesByView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainBundlesByView**(): `WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L63)

Returns the `WeakMap<View3D, TMainBundleCache>` managing main render bundle caches keyed by `View3D`.

##### Returns

`WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

Per-view main render bundle cache (`WeakMap<View3D, TMainBundleCache>`)

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:180](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L180)

Releases all cached render bundle references and destroys the renderer.

#### Returns

`void`

***

***

### executeSingleBundle()

> **executeSingleBundle**(`passEncoder`, `bundle`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L78)

Executes a single `GPURenderBundle` with Zero-GC by reusing a pre-allocated fixed tuple array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passEncoder` | `GPURenderPassEncoder` | Target render pass encoder on which to execute the bundle |
| `bundle` | `GPURenderBundle` | `GPURenderBundle` instance to execute |

#### Returns

`void`

***

***

### getShadowBundle()

> **getShadowBundle**(`cascadeIndex`): `GPURenderBundle`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L94)

Returns the cached `GPURenderBundle` for the specified shadow cascade index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Shadow cascade index (`0`~`3`) to look up |

#### Returns

`GPURenderBundle`

Cached `GPURenderBundle`, or `null` if none exists

***

***

### isShadowBundleValid()

> **isShadowBundleValid**(`cascadeIndex`, `systemBG`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L133)

Checks whether the render bundle for the specified shadow cascade is valid and matches the current system bind group.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Shadow cascade index (`0`~`3`) to check |
| `systemBG` | `GPUBindGroup` | Current frame's system uniform bind group |

#### Returns

`boolean`

Whether the cached shadow bundle is valid

***

***

### markAllBundlesDirty()

> `abstract` **markAllBundlesDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L174)

Invalidates all render bundle caches for both main and shadow passes.

#### Returns

`void`

***

***

### markMainBundleDirty()

> **markMainBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L166)

Invalidates main pass render bundle caches for all views.

#### Returns

`void`

***

***

### markShadowBundleDirty()

> **markShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L146)

Invalidates all shadow cascade render bundle caches and invokes the `onShadowBundleDirty` hook.

#### Returns

`void`

***

***

### onShadowBundleDirty()

> **onShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L159)

Hook method for subclasses to reset additional state when shadow render bundles are invalidated.

#### Returns

`void`

***

***

### setShadowBundle()

> **setShadowBundle**(`cascadeIndex`, `bundle`, `systemBG`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L112)

Caches a `GPURenderBundle` and system bind group reference for the specified shadow cascade index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Target shadow cascade index (`0`~`3`) |
| `bundle` | `GPURenderBundle` | `GPURenderBundle` to store, or `null` |
| `systemBG` | `GPUBindGroup` | System uniform bind group used when recording the bundle |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
