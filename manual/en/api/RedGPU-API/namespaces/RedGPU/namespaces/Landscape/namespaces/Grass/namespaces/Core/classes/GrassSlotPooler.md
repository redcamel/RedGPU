[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Grass](../../../README.md) / [Core](../README.md) / GrassSlotPooler

# Class: GrassSlotPooler

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L18)

Internal system class that pools and manages per-type grass rendering uniform parameter slots in a mega UBO.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md)

## Constructors



***

### Constructor

> **new GrassSlotPooler**(`redGPUContext`): `GrassSlotPooler`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L33)

Creates a `GrassSlotPooler` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`GrassSlotPooler`

#### Overrides

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#constructor)

## Landscape



## Other



***

### PARAMS\_SIZE\_BYTES

> `static` **PARAMS\_SIZE\_BYTES**: `number` = `96`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L23)

Effective uniform parameter size per slot (in bytes)

***

***

### writeGrassSlot()

> **writeGrassSlot**(`slot`, `grass`, `hasValidVbt`): `void`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L56)

Writes rendering and shading parameters of a grass type to the specified slot and uploads them to the GPU buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | Target slot index to write to |
| `grass` | [`Grass`](../../../classes/Grass.md) | Grass type instance |
| `hasValidVbt` | `boolean` | Whether the terrain base color texture (VBT) is valid |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### SLOT\_STRIDE\_FLOATS

> `static` **SLOT\_STRIDE\_FLOATS**: `number` = `64`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L24)

Number of `Float32` elements per slot (`64`).

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`SLOT_STRIDE_FLOATS`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#slot_stride_floats)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#antialiasingmanager)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#commandencodermanager)

***

***

### cpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L127)

Returns the CPU-side `Float32Array` buffer for all slot data.

##### Returns

`Float32Array`

CPU slot `Float32Array` buffer

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`cpuBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#cpubuffer)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`cpuUint32View`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#cpuuint32view)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`gpuBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#gpubuffer)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#gpudevice)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#instanceid)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`maxSlots`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#maxslots)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#name)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`paramsSizeBytes`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#paramssizebytes)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#redgpucontext)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#resourcemanager)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#uuid)

***

***

### allocateSlot()

> **allocateSlot**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L151)

Allocates and returns an available UBO slot index from the free stack.

#### Returns

`number`

Allocated slot index (`0` or greater), or `-1` if slots are exhausted

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`allocateSlot`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#allocateslot)

***

***

### clear()

> **clear**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L186)

Clears all slot data and resets all slots to the unallocated state.

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`clear`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:203](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L203)

Destroys the GPU buffer of the slot pool and resets internal state.

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#destroy)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`freeSlot`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#freeslot)

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

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`uploadSlotBytes`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#uploadslotbytes)

***

</details>
