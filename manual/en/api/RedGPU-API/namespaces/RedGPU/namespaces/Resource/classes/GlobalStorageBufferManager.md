[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / GlobalStorageBufferManager

# Class: GlobalStorageBufferManager

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:16](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L16)

Universal global buffer manager designed to control various properties required for the Vertex Stage and Fragment Stage in a global SSBO (Storage Buffer) architecture for maximizing WebGPU performance, handling CPU-to-GPU data uploads.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new GlobalStorageBufferManager**(`redGPUContext`, `elementSize`, `initialSlotCount?`, `label?`): `GlobalStorageBufferManager`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:116](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L116)

Creates an instance of GlobalStorageBufferManager.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext context instance |
| `elementSize` | `number` | `undefined` | Byte size of a single slot element |
| `initialSlotCount` | `number` | `1024` | Initial slot capacity (default: 1024) |
| `label` | `string` | `"GLOBAL_STORAGE_BUFFER"` | Buffer identification label (default: 'GLOBAL_STORAGE_BUFFER') |

#### Returns

`GlobalStorageBufferManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### RESIZE\_LINEAR\_ADDITION\_BYTES

> `readonly` `static` **RESIZE\_LINEAR\_ADDITION\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:27](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L27)

Fixed memory byte size to add during linear growth after exceeding the threshold (8MB)

***

### RESIZE\_THRESHOLD\_BYTES

> `readonly` `static` **RESIZE\_THRESHOLD\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:21](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L21)

Threshold buffer size to transition from exponential (2x) to linear growth (32MB)

## Accessors

### activeSlotCount

#### Get Signature

> **get** **activeSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:198](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L198)

Returns the number of currently allocated and active slots.

##### Returns

`number`

***

### cpuData

#### Get Signature

> **get** **cpuData**(): `ArrayBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:166](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L166)

Returns the CPU-side backing mirror buffer memory space (ArrayBuffer). (For debugging and testing purposes)

##### Returns

`ArrayBuffer`

***

### dirtyMax

#### Get Signature

> **get** **dirtyMax**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:182](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L182)

Returns the maximum index of the slot currently tracked as dirty. (For debugging and testing purposes)

##### Returns

`number`

***

### dirtyMin

#### Get Signature

> **get** **dirtyMin**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:174](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L174)

Returns the minimum index of the slot currently tracked as dirty. (For debugging and testing purposes)

##### Returns

`number`

***

### elementSize

#### Get Signature

> **get** **elementSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:150](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L150)

Returns the byte size of a single slot element.

##### Returns

`number`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:134](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L134)

Returns the GPUBuffer resource instance.

##### Returns

`GPUBuffer`

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:158](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L158)

Returns the buffer identification label.

##### Returns

`string`

***

### remainingSlotCount

#### Get Signature

> **get** **remainingSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:206](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L206)

Returns the number of remaining available slots.

##### Returns

`number`

***

### safeMaxBufferSize

#### Get Signature

> **get** **safeMaxBufferSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:190](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L190)

Returns the hardware-allowed maximum buffer byte size for testing and debugging.

##### Returns

`number`

***

### totalSlotCount

#### Get Signature

> **get** **totalSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:142](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L142)

Returns the total number of slots (capacity) the buffer can accommodate.

##### Returns

`number`

***

### allocateSlot()

> **allocateSlot**(): [`BufferSlot`](../interfaces/BufferSlot.md)

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:238](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L238)

Allocates a buffer slot. Reuses freed slot indices first if available in the pool.

#### Returns

[`BufferSlot`](../interfaces/BufferSlot.md)

Information of the allocated slot's index and byte offset

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:210](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L210)

#### Returns

`void`

***

### flush()

> **flush**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:337](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L337)

Uploads only the dirty-tracked range (the portion with modified data) to the GPU memory.

#### Returns

`void`

***

### freeSlot()

> **freeSlot**(`index`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:275](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L275)

Frees the allocated slot index and registers it back to the reuse pool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index number of the slot to be freed |

#### Returns

`void`

***

### setOnResize()

> **setOnResize**(`callback`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:226](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L226)

Registers a resize callback. Called after dynamic resizing is executed due to capacity limit exceedance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`manager`) => `void` | Callback function to be called after resizing |

#### Returns

`void`

***

### updateFloatData()

> **updateFloatData**(`index`, `data`, `floatOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:293](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L293)

Writes Float32 data to a specific slot index region and tracks the region as dirty.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | Index number of the slot to update data |
| `data` | `Float32Array` | `undefined` | Float32 data array to upload |
| `floatOffsetInsideElement` | `number` | `0` | Additional float unit offset inside the slot (default: 0) |

#### Returns

`void`

***

### updateUintData()

> **updateUintData**(`index`, `data`, `uintOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:320](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L320)

Writes Uint32 data to a specific slot index region and tracks the region as dirty.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | Index number of the slot to update data |
| `data` | `Uint32Array` | `undefined` | Uint32 data array to upload |
| `uintOffsetInsideElement` | `number` | `0` | Additional uint unit offset inside the slot (default: 0) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
