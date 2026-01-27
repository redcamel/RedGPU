[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / StorageBuffer

# Class: StorageBuffer

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/storageBuffer/StorageBuffer.ts#L18)


Class that manages storage buffers.

* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data);
```

## Extends

- [`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md)

## Constructors

### Constructor

> **new StorageBuffer**(`redGPUContext`, `uniformData`, `label`, `cacheKey`): `StorageBuffer`

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:41](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/storageBuffer/StorageBuffer.ts#L41)


Creates a StorageBuffer instance.

* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data, 'MyStorageBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `uniformData` | `ArrayBuffer` | `undefined` | `ArrayBuffer` data to upload |
| `label` | `string` | `''` | Buffer label (optional) |
| `cacheKey` | `string` | `''` | Buffer cache key (optional) |

#### Returns

`StorageBuffer`

#### Overrides

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L21)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_DATA_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_data_symbol)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L52)


Returns the cache key.

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:73](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L73)


Returns the buffer data (`ArrayBuffer`).

##### Returns

`ArrayBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`data`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#data)

***

### dataViewF32

#### Get Signature

> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L81)


Returns the buffer data as a `Float32Array` view.

##### Returns

`Float32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewF32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewf32)

***

### dataViewU32

#### Get Signature

> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:89](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L89)


Returns the buffer data as a `Uint32Array` view.

##### Returns

`Uint32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewU32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewu32)

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L60)


Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:97](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L97)


Returns the buffer size.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#targetresourcemanagedstate)

***

### uniformBufferDescriptor

#### Get Signature

> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L105)


Returns the `GPUBufferDescriptor`.

##### Returns

`GPUBufferDescriptor`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uniformBufferDescriptor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uniformbufferdescriptor)

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L68)


Returns the GPUBufferUsageFlags.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L84)


Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__fireListenerList`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/ABaseBuffer.ts#L92)


Destroys the resource.

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#destroy)

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:119](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/buffer/core/AUniformBaseBuffer.ts#L119)


Writes data to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target uniform information (including View constructor and offset) |
| `value` | `any` | Value to write |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`writeOnlyBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#writeonlybuffer)
