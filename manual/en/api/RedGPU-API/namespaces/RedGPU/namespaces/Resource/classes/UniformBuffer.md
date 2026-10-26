[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / UniformBuffer

# Class: UniformBuffer

Defined in: [src/resources/buffer/uniformBuffer/UniformBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/uniformBuffer/UniformBuffer.ts#L18)

Class that manages uniform buffers (`GPUBuffer`).

***

### Example
```typescript
const uniformBuffer = new RedGPU.Resource.UniformBuffer(redGPUContext, data);
```

## Extends

- [`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md)

## Constructors



***

### Constructor

> **new UniformBuffer**(`redGPUContext`, `uniformData`, `label?`, `cacheKey?`): `UniformBuffer`

Defined in: [src/resources/buffer/uniformBuffer/UniformBuffer.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/uniformBuffer/UniformBuffer.ts#L41)

Creates a UniformBuffer instance.

#### Example
```typescript
const uniformBuffer = new RedGPU.Resource.UniformBuffer(redGPUContext, data, 'MyUniformBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `uniformData` | `ArrayBuffer` | `undefined` | `ArrayBuffer` data to upload |
| `label?` | `string` | `''` | Buffer label (optional) |
| `cacheKey?` | `string` | `''` | Buffer cache key (optional) |

#### Returns

`UniformBuffer`

#### Overrides

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#constructor)

## Properties



## Accessors



## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_cache_key)

***

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L24)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_DATA_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_data_symbol)

***

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_symbol)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`antialiasingManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L57)

Returns the buffer cache key. Returns the uuid if not specified.

##### Returns

`string`

Cache key

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#cachekey)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`commandEncoderManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#commandencodermanager)

***

***

### data

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L94)

Returns the CPU-side buffer data.

##### Returns

`ArrayBuffer`

Buffer data (`ArrayBuffer`)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`data`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#data)

***

***

### dataViewF32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L106)

Returns the `Float32Array` view of the buffer data.

##### Returns

`Float32Array`

`Float32Array` view

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewF32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewf32)

***

***

### dataViewU32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L118)

Returns the `Uint32Array` view of the buffer data.

##### Returns

`Uint32Array`

`Uint32Array` view

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewU32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewu32)

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L69)

Returns the internal GPUBuffer object.

##### Returns

`GPUBuffer`

GPUBuffer object

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpubuffer)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpudevice)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`instanceId`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#instanceid)

***

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L82)

Returns the buffer debug label.

##### Returns

`string`

Label string

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`label`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#label)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#name)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#redgpucontext)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`revision`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#revision)

***

***

### size

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L130)

Returns the buffer size in bytes.

##### Returns

`number`

Size in bytes

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#size)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ManagementResourceBase.ts#L50)

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Resource managed status info object

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#targetresourcemanagedstate)

***

***

### uniformBufferDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:142](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L142)

Returns the descriptor used to create the buffer.

##### Returns

`GPUBufferDescriptor`

`GPUBufferDescriptor` object

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uniformBufferDescriptor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uniformbufferdescriptor)

***

***

### usage

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L81)

Returns the GPU buffer usage flags.

##### Returns

`number`

GPUBufferUsageFlags value

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#usage)

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

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L105)

Returns the video memory usage in bytes.

##### Returns

`number`

Video memory usage

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#videomemorysize)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__removedirtypipelinelistener)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L150)

Releases the GPU buffer and data views. Repeated calls are ignored.

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#destroy)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`notifyUpdate`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#notifyupdate)

***

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/AUniformBaseBuffer.ts#L173)

Writes a value directly to the GPU buffer at the given uniform location.

Boolean values are converted to 1 or 0.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target uniform info (contains `View` constructor and `uniformOffset`) |
| `value` | `any` | Value to write (number, boolean, or array) |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`writeOnlyBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#writeonlybuffer)

</details>
