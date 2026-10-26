[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterManager

# Abstract Class: AScatterManager\<TType, TOptions\>

Defined in: [src/landscape/core/scatter/AScatterManager.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L26)

Abstract manager class that oversees registration, lifecycle, GPU baking/culling updates, and rendering of terrain scatter (foliage, grass, etc.) types.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageManager`](../../../../Foliage/classes/FoliageManager.md)
- [`GrassManager`](../../../../Grass/classes/GrassManager.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| <a id="type-parameter-ttype"></a> `TType` *extends* [`AScatterType`](AScatterType.md) | [`AScatterType`](AScatterType.md) | Scatter type class managed by the manager (subclass of `AScatterType`) |
| <a id="type-parameter-toptions"></a> `TOptions` *extends* [`AScatterTypeInitOptions`](../interfaces/AScatterTypeInitOptions.md) | [`AScatterTypeInitOptions`](../interfaces/AScatterTypeInitOptions.md) | Initialization options interface passed when creating a scatter type (subtype of `AScatterTypeInitOptions`) |

## Constructors



***

### Constructor

> **new AScatterManager**\<`TType`, `TOptions`\>(`landscape`): `AScatterManager`\<`TType`, `TOptions`\>

Defined in: [src/landscape/core/scatter/AScatterManager.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L44)

Initializes an `AScatterManager` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | Target `Landscape` instance that owns this scatter manager |

#### Returns

`AScatterManager`\<`TType`, `TOptions`\>

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L69)

Gets or sets whether the scatter manager is enabled.

##### Returns

`boolean`

Whether enabled

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **instanceCapacity**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L107)

Returns the maximum instance capacity allocated in the mega buffer.

##### Returns

`number`

Maximum instance capacity

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../../../classes/Landscape.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L57)

Returns the `Landscape` instance to which this scatter manager belongs.

##### Returns

[`Landscape`](../../../../../classes/Landscape.md)

Owner `Landscape` instance

***

***

### shadowDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L136)

Returns the total number of shadow pass draw calls across all scatter types with `castShadow` enabled.

##### Returns

`number`

Total shadow pass draw call count

***

***

### totalDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L117)

Returns the total number of main pass draw calls across all registered scatter types when enabled.

##### Returns

`number`

Total main pass draw call count

***

***

### totalInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **totalInstanceCount**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L97)

Returns the total number of allocated scatter instances.

##### Returns

`number`

Total instance count

***

***

### types

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **types**(): `TType`[]

Defined in: [src/landscape/core/scatter/AScatterManager.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L85)

Returns the list of all currently registered scatter types (`TType[]`).

##### Returns

`TType`[]

Array of registered scatter types (`TType[]`)

***

## Methods



***

### addType()

> `abstract` **addType**(`options`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L214)

Creates a new scatter type and registers it with the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `TOptions` | Scatter type initialization options |

#### Returns

`TType`

Created and registered scatter type instance

***

***

### clearTypes()

> **clearTypes**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L195)

Sequentially removes all registered scatter types and clears the internal map.

#### Returns

`void`

***

***

### computeTypeDrawCalls()

> `abstract` **computeTypeDrawCalls**(`type`): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L161)

Computes the number of main render pass draw calls for an individual scatter type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | Target scatter type for which to compute the draw call count |

#### Returns

`number`

Main pass draw call count for the type

***

***

### computeTypeShadowDrawCalls()

> `abstract` **computeTypeShadowDrawCalls**(`type`): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L174)

Computes the number of shadow render pass draw calls for an individual scatter type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | Target scatter type for which to compute the shadow draw call count |

#### Returns

`number`

Shadow pass draw call count for the type

***

***

### destroy()

> `abstract` **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L275)

Destroys all scatter types and GPU resources managed by the manager.

#### Returns

`void`

***

***

### getTypeByName()

> **getTypeByName**(`name`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L187)

Looks up a registered scatter type instance by its unique name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Name of the scatter type to look up |

#### Returns

`TType`

Matching scatter type instance, or `undefined` if not found

***

***

### rebakeAll()

> `abstract` **rebakeAll**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L233)

Requests a full rebake of instance placements for all registered scatter types.

#### Returns

`void`

***

***

### registerTypeInternal()

> **registerTypeInternal**(`type`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L285)

Registers a scatter type instance into the internal array and name map (`Map<string, TType>`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | Scatter type instance to register |

#### Returns

`void`

***

***

### removeType()

> `abstract` **removeType**(`target`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L227)

Removes the specified scatter type instance or the type matching the given name from the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| `TType` | Scatter type instance or type name string to remove |

#### Returns

`boolean`

Whether the removal succeeded

***

***

### render()

> `abstract` **render**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L256)

Renders visible scatter instances in the main render pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | Currently rendering `View3D` instance |
| `passEncoder` | `GPURenderPassEncoder` | Main render pass encoder |

#### Returns

`void`

***

***

### renderShadow()

> `abstract` **renderShadow**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L269)

Renders shadow-casting scatter instances in the directional shadow render pass.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | Currently rendering `View3D` instance |
| `passEncoder` | `GPURenderPassEncoder` | Shadow render pass encoder |

#### Returns

`void`

***

***

### unregisterTypeInternal()

> **unregisterTypeInternal**(`target`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L302)

Unregisters and returns the target scatter type from the internal array and name map (`Map<string, TType>`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| `TType` | Scatter type instance or type name string to unregister |

#### Returns

`TType`

Unregistered scatter type instance, or `null` if not found

***

***

### update()

> `abstract` **update**(`renderViewStateData`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L243)

Updates the scatter baking and GPU culling pipelines every frame based on the view state data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | View rendering state data for the current frame |

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
