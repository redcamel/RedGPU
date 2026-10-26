[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageManager

# Class: FoliageManager

Defined in: [src/landscape/foliage/FoliageManager.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L41)

Class that manages foliage type registration, sub-cell streaming, GPU culling, and rendering on a `Landscape`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Register a new foliage type via the landscape foliage manager
const foliage = landscape.foliageManager.addType({
    name: 'PineTree',
    lods: [{ mesh: pineMesh, lodDistance: 80 }],
    densityPerHectare: 120
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md)\<[`Foliage`](Foliage.md), [`FoliageOptions`](../interfaces/FoliageOptions.md)\>

## Constructors



***

### Constructor

> **new FoliageManager**(`landscape`): `FoliageManager`

Defined in: [src/landscape/foliage/FoliageManager.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L64)

Creates a `FoliageManager` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../classes/Landscape.md) | Target `Landscape` instance where foliage is placed |

#### Returns

`FoliageManager`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterManager.md#constructor)

## Accessors



***

### depthPrepassDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassDrawCalls**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L125)

Returns the total number of draw calls issued in the depth prepass.

##### Returns

`number`

Number of depth prepass draw calls

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceCapacity**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:193](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L193)

Returns the maximum instance capacity of the mega buffer (`FoliageMegaBuffer`).

##### Returns

`number`

Maximum instance capacity

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`instanceCapacity`](../../Core/namespaces/Scatter/classes/AScatterManager.md#instancecapacity)

***

***

### mainPassDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainPassDrawCalls**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:152](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L152)

Returns the total number of draw calls issued in the main render pass.

##### Returns

`number`

Number of main pass draw calls

***

***

### subCellSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **subCellSize**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L205)

Returns the side length of a foliage streaming sub-cell in meters.

##### Returns

`number`

Sub-cell size in meters

***

***

### totalInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalInstanceCount**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L174)

Returns the total number of active instances across all foliage types.

##### Returns

`number`

Total active instance count

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`totalInstanceCount`](../../Core/namespaces/Scatter/classes/AScatterManager.md#totalinstancecount)

***

## Methods



***

### addType()

> **addType**(`options`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/foliage/FoliageManager.ts:419](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L419)

Creates a new `Foliage` type and registers it with the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`FoliageOptions`](../interfaces/FoliageOptions.md) | Foliage creation options (`FoliageOptions`) |

#### Returns

[`Foliage`](Foliage.md)

Created and registered `Foliage` instance

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`addType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#addtype)

***

***

### clearTypes()

> **clearTypes**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:402](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L402)

Removes all registered foliage types and resets internal dirty masks.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`clearTypes`](../../Core/namespaces/Scatter/classes/AScatterManager.md#cleartypes)

***

***

### computeTypeDrawCalls()

> **computeTypeDrawCalls**(`foliage`): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L328)

Computes the number of main and depth prepass draw calls for a single foliage type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliage` | [`Foliage`](Foliage.md) | Target `Foliage` instance to compute |

#### Returns

`number`

Number of draw calls

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypedrawcalls)

***

***

### computeTypeShadowDrawCalls()

> **computeTypeShadowDrawCalls**(`foliage`): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:488](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L488)

Computes the number of shadow pass draw calls for a single foliage type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliage` | [`Foliage`](Foliage.md) | Target `Foliage` instance to compute |

#### Returns

`number`

Number of shadow pass draw calls

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeShadowDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypeshadowdrawcalls)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L237)

Releases all foliage types and GPU resources held by the manager.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterManager.md#destroy)

***

***

### dispatchCullingPass()

> **dispatchCullingPass**(`computePass`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L229)

Records foliage GPU culling dispatch commands into the shared compute pass encoder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | Target `GPUComputePassEncoder` instance |

#### Returns

`void`

***

***

### rebakeAll()

> **rebakeAll**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:464](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L464)

Immediately rebakes mounted sub-cells for all registered foliage types.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`rebakeAll`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rebakeall)

***

***

### recordResetCommands()

> **recordResetCommands**(`encoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L217)

Records commands to reset indirect draw buffer counters into the command encoder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | Target `GPUCommandEncoder` instance |

#### Returns

`void`

***

***

### removeType()

> **removeType**(`target`): `boolean`

Defined in: [src/landscape/foliage/FoliageManager.ts:384](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L384)

Removes and destroys the foliage type matching the specified instance or name from the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Foliage`](Foliage.md) | `Foliage` instance or foliage type name to remove |

#### Returns

`boolean`

Whether the removal succeeded

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`removeType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#removetype)

***

***

### render()

> **render**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:350](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L350)

Renders all registered foliage types in the main render pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Currently rendering `View3D` instance |
| `passEncoder` | `GPURenderPassEncoder` | Target `GPURenderPassEncoder` instance |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`render`](../../Core/namespaces/Scatter/classes/AScatterManager.md#render)

***

***

### renderShadow()

> **renderShadow**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L367)

Renders shadows for all registered foliage types in the directional shadow pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Currently rendering `View3D` instance |
| `passEncoder` | `GPURenderPassEncoder` | `GPURenderPassEncoder` instance of the shadow pass |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`renderShadow`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rendershadow)

***

***

### repopulateAll()

> **repopulateAll**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:448](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L448)

Clears sub-cell caches for all registered foliage types and schedules instance repopulation.

#### Returns

`void`

***

***

### update()

> **update**(`renderViewStateData`, `standalone?`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:257](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/FoliageManager.ts#L257)

Updates foliage sub-cell streaming, uniform buffers, and culling state every frame.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | `undefined` | Render view state data for the current frame |
| `standalone?` | `boolean` | `false` | Whether to immediately dispatch culling in a standalone compute pass (default: `false`) |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`update`](../../Core/namespaces/Scatter/classes/AScatterManager.md#update)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`antialiasingManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`commandEncoderManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#commandencodermanager)

***

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L69)

Gets or sets whether the scatter manager is enabled.

##### Returns

`boolean`

Whether enabled

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`enabled`](../../Core/namespaces/Scatter/classes/AScatterManager.md#enabled)

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

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`gpuDevice`](../../Core/namespaces/Scatter/classes/AScatterManager.md#gpudevice)

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

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`instanceId`](../../Core/namespaces/Scatter/classes/AScatterManager.md#instanceid)

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../classes/Landscape.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L57)

Returns the `Landscape` instance to which this scatter manager belongs.

##### Returns

[`Landscape`](../../../classes/Landscape.md)

Owner `Landscape` instance

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`landscape`](../../Core/namespaces/Scatter/classes/AScatterManager.md#landscape)

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

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`name`](../../Core/namespaces/Scatter/classes/AScatterManager.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`redGPUContext`](../../Core/namespaces/Scatter/classes/AScatterManager.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`resourceManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#resourcemanager)

***

***

### shadowDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L136)

Returns the total number of shadow pass draw calls across all scatter types with `castShadow` enabled.

##### Returns

`number`

Total shadow pass draw call count

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`shadowDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#shadowdrawcalls)

***

***

### totalDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L117)

Returns the total number of main pass draw calls across all registered scatter types when enabled.

##### Returns

`number`

Total main pass draw call count

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`totalDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#totaldrawcalls)

***

***

### types

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **types**(): `TType`[]

Defined in: [src/landscape/core/scatter/AScatterManager.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L85)

Returns the list of all currently registered scatter types (`TType[]`).

##### Returns

`TType`[]

Array of registered scatter types (`TType[]`)

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`types`](../../Core/namespaces/Scatter/classes/AScatterManager.md#types)

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

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`uuid`](../../Core/namespaces/Scatter/classes/AScatterManager.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### getTypeByName()

> **getTypeByName**(`name`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L187)

Looks up a registered scatter type instance by its unique name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Name of the scatter type to look up |

#### Returns

[`Foliage`](Foliage.md)

Matching scatter type instance, or `undefined` if not found

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`getTypeByName`](../../Core/namespaces/Scatter/classes/AScatterManager.md#gettypebyname)

***

***

### registerTypeInternal()

> **registerTypeInternal**(`type`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:285](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L285)

Registers a scatter type instance into the internal array and name map (`Map<string, TType>`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`Foliage`](Foliage.md) | Scatter type instance to register |

#### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`registerTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#registertypeinternal)

***

***

### unregisterTypeInternal()

> **unregisterTypeInternal**(`target`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:302](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterManager.ts#L302)

Unregisters and returns the target scatter type from the internal array and name map (`Map<string, TType>`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Foliage`](Foliage.md) | Scatter type instance or type name string to unregister |

#### Returns

[`Foliage`](Foliage.md)

Unregistered scatter type instance, or `null` if not found

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`unregisterTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#unregistertypeinternal)

***

</details>
