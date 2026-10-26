[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterSlotPooler

# Abstract Class: AScatterSlotPooler

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L17)

Abstract base class that pools and manages 256-byte aligned UBO slots conforming to Dynamic Uniform Offset specifications.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageSlotPooler`](../../../../Foliage/namespaces/Core/classes/FoliageSlotPooler.md)
- [`GrassSlotPooler`](../../../../Grass/namespaces/Core/classes/GrassSlotPooler.md)

## Constructors



***

### Constructor

> **new AScatterSlotPooler**(`redGPUContext`, `maxSlots`, `paramsSizeBytes`, `bufferLabel`): `AScatterSlotPooler`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L53)

Initializes an `AScatterSlotPooler` instance and allocates CPU/GPU slot pool buffers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `maxSlots` | `number` | Maximum number of slots to manage in the pool |
| `paramsSizeBytes` | `number` | Actual byte size of uniform parameters within an individual slot (`256` or less) |
| `bufferLabel` | `string` | Debug label for the created GPU uniform buffer |

#### Returns

`AScatterSlotPooler`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Landscape



***

### SLOT\_STRIDE\_FLOATS

> `static` **SLOT\_STRIDE\_FLOATS**: `number` = `64`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L24)

Number of `Float32` elements per slot (`64`).

## Other



***

### cpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L127)

Returns the CPU-side `Float32Array` buffer for all slot data.

##### Returns

`Float32Array`

CPU slot `Float32Array` buffer

***

***

### cpuUint32View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuUint32View**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L139)

Returns the CPU-side `Uint32Array` view for all slot data.

##### Returns

`Uint32Array`

CPU slot `Uint32Array` view

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L115)

Returns the unified uniform `GPUBuffer` holding all slot data.

##### Returns

`GPUBuffer`

Unified uniform `GPUBuffer`, or `null` if destroyed

***

***

### maxSlots

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxSlots**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L91)

Returns the maximum number of slots the pool can accommodate.

##### Returns

`number`

Maximum slot count

***

***

### paramsSizeBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **paramsSizeBytes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L103)

Returns the actual byte size of uniform parameters within a single slot.

##### Returns

`number`

Slot parameter byte size

***

***

### allocateSlot()

> **allocateSlot**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L151)

Allocates and returns an available UBO slot index from the free stack.

#### Returns

`number`

Allocated slot index (`0` or greater), or `-1` if slots are exhausted

***

***

### clear()

> **clear**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L186)

Clears all slot data and resets all slots to the unallocated state.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:203](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L203)

Destroys the GPU buffer of the slot pool and resets internal state.

#### Returns

`void`

***

***

### freeSlot()

> **freeSlot**(`slot`): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L168)

Zeroes out the data of a used UBO slot and returns it to the free stack.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | Slot index to free |

#### Returns

`void`

***

***

### uploadSlotBytes()

> **uploadSlotBytes**(`slot`, `byteLength`): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L223)

Uploads the CPU buffer data of the specified slot to the corresponding offset in the GPU uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | Target slot index to upload |
| `byteLength` | `number` | Byte length to copy |

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

***

</details>
