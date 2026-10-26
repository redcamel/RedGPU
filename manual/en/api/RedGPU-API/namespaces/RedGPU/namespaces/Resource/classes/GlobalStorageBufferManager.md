[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / GlobalStorageBufferManager

# Class: GlobalStorageBufferManager

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L31)

Manager that handles slot allocation/release and CPU-to-GPU data upload for a global SSBO (Storage Buffer).

Uploads only the modified slot range (dirty tracking); on overflow it grows 2x up to 32MB, then linearly by 8MB (max 128MB).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Correct access method
const globalVertexSSBO = redGPUContext.globalVertexSSBO;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new GlobalStorageBufferManager**(`redGPUContext`, `elementSize`, `initialSlotCount?`, `label?`): `GlobalStorageBufferManager`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L82)

Creates the GPU storage buffer and CPU mirror buffer with the given slot size and capacity.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `elementSize` | `number` | `undefined` | Byte size of a single slot element |
| `initialSlotCount?` | `number` | `1024` | Initial slot capacity (default: 1024) |
| `label?` | `string` | `"GLOBAL_STORAGE_BUFFER"` | Buffer debug label (default: 'GLOBAL_STORAGE_BUFFER') |

#### Returns

`GlobalStorageBufferManager`

#### Throws

Throws an error if the initial buffer size exceeds the hardware-allowed maximum (up to 128MB).

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### RESIZE\_LINEAR\_ADDITION\_BYTES

> <span class="readonly-badge">readonly</span> `static` **RESIZE\_LINEAR\_ADDITION\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L42)

Bytes added per linear growth step after exceeding the threshold (8MB)

***

***

### RESIZE\_THRESHOLD\_BYTES

> <span class="readonly-badge">readonly</span> `static` **RESIZE\_THRESHOLD\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L36)

Buffer size threshold for switching from 2x growth to linear growth (32MB)

## Accessors



***

### activeSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:200](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L200)

Returns the number of slots currently in use.

##### Returns

`number`

Active slot count

***

***

### cpuData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuData**(): `ArrayBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:152](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L152)

Returns the CPU-side mirror buffer. (For debugging and testing)

##### Returns

`ArrayBuffer`

CPU mirror `ArrayBuffer`

***

***

### dirtyMax

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dirtyMax**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:176](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L176)

Returns the maximum dirty slot index being tracked. (For debugging and testing)

##### Returns

`number`

Maximum dirty index (-Infinity if none)

***

***

### dirtyMin

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dirtyMin**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L164)

Returns the minimum dirty slot index being tracked. (For debugging and testing)

##### Returns

`number`

Minimum dirty index (Infinity if none)

***

***

### elementSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **elementSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L128)

Returns the byte size of a single slot element.

##### Returns

`number`

Slot byte size

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L104)

Returns the GPU storage buffer. It is replaced with a new buffer on resize.

##### Returns

`GPUBuffer`

GPUBuffer object

***

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L140)

Returns the buffer debug label.

##### Returns

`string`

Label string

***

***

### remainingSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **remainingSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:212](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L212)

Returns the number of remaining available slots.

##### Returns

`number`

Remaining slot count

***

***

### safeMaxBufferSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **safeMaxBufferSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L188)

Returns the maximum allowed buffer byte size. (The smaller of `maxStorageBufferBindingSize` and 128MB)

##### Returns

`number`

Maximum buffer byte size

***

***

### totalSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L116)

Returns the total slot capacity of the buffer.

##### Returns

`number`

Total slot count

***

## Methods



***

### allocateSlot()

> **allocateSlot**(): [`BufferSlot`](../interfaces/BufferSlot.md)

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:257](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L257)

Allocates a buffer slot. Reuses freed slots first and grows the buffer when capacity runs out.

#### Example
```typescript
const slot = redGPUContext.globalVertexSSBO.allocateSlot();
console.log(slot.index, slot.byteOffset);
```

#### Returns

[`BufferSlot`](../interfaces/BufferSlot.md)

Index and byte offset of the allocated slot

#### Throws

Throws an error if the grown size exceeds the maximum allowed size.

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L220)

Destroys the GPU buffer and releases the CPU mirror data and slot pool.

#### Returns

`void`

***

***

### flush()

> **flush**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:360](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L360)

Uploads only the dirty slot range to the GPU buffer and resets the dirty state.

#### Returns

`void`

***

***

### freeSlot()

> **freeSlot**(`index`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:292](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L292)

Returns a slot index to the reuse pool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Slot index to free |

#### Returns

`void`

***

***

### setOnResize()

> **setOnResize**(`callback`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L236)

Registers a callback invoked after buffer resizing. Mainly used to recreate bind groups.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`manager`) => `void` | Callback function called after resizing |

#### Returns

`void`

***

***

### updateFloatData()

> **updateFloatData**(`index`, `data`, `floatOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L313)

Writes Float32 data for a slot into the CPU mirror buffer and marks it dirty. The actual upload happens in `flush()`.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | Target slot index |
| `data` | `Float32Array` | `undefined` | `Float32Array` data to write |
| `floatOffsetInsideElement?` | `number` | `0` | Offset inside the slot in floats (default: 0) |

#### Returns

`void`

#### Throws

Throws an error if offset plus data length exceeds the slot size.

***

***

### updateUintData()

> **updateUintData**(`index`, `data`, `uintOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:343](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L343)

Writes Uint32 data for a slot into the CPU mirror buffer and marks it dirty. The actual upload happens in `flush()`.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | Target slot index |
| `data` | `Uint32Array` | `undefined` | `Uint32Array` data to write |
| `uintOffsetInsideElement?` | `number` | `0` | Offset inside the slot in uints (default: 0) |

#### Returns

`void`

#### Throws

Throws an error if offset plus data length exceeds the slot size.

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
