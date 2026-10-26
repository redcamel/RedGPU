[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeInteractionManager

# Class: LakeInteractionManager

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L114)

Manager class that selects active meshes intersecting the lake surface and computes movement speed and wave parameters.

Automatically created internally when a `Lake` instance is constructed.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new LakeInteractionManager**(`redGPUContext`): `LakeInteractionManager`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L126)

Creates a `LakeInteractionManager` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`LakeInteractionManager`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### collectActiveMeshes()

> **collectActiveMeshes**(`dt`, `domainCenterX`, `domainCenterZ`, `domainRadius`, `waterLevel`, `verticalRange?`): [`LakeActiveMeshEntry`](../interfaces/LakeActiveMeshEntry.md)[]

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:156](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L156)

Collects active meshes (`LakeActiveMeshEntry[]`) located within the simulation region.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `dt` | `number` | `undefined` | Frame delta time in seconds |
| `domainCenterX` | `number` | `undefined` | Simulation domain center world X coordinate |
| `domainCenterZ` | `number` | `undefined` | Simulation domain center world Z coordinate |
| `domainRadius` | `number` | `undefined` | Effective radius of the simulation domain |
| `waterLevel` | `number` | `undefined` | World Y coordinate of the lake water surface |
| `verticalRange?` | `number` | `6.0` | Vertical check range above and below the water level (default: `6.0`) |

#### Returns

[`LakeActiveMeshEntry`](../interfaces/LakeActiveMeshEntry.md)[]

Array of collected active mesh entries (`LakeActiveMeshEntry[]`)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:260](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L260)

Clears internal motion trackers and the active mesh buffer.

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
