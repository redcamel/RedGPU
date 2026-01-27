[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / AUniformBaseBuffer

# Abstract Class: AUniformBaseBuffer

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:20](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L20)


Abstract base class for uniform buffer resources.

::: warning

This class is an abstract class and cannot be instantiated directly.<br/>Use it through inheritance.
:::

## Extends

- [`ABaseBuffer`](ABaseBuffer.md)

## Extended by

- [`StorageBuffer`](../../../classes/StorageBuffer.md)
- [`UniformBuffer`](../../../classes/UniformBuffer.md)

## Constructors

### Constructor

> `protected` **new AUniformBaseBuffer**(`redGPUContext`, `MANAGED_STATE_KEY`, `usage`, `data`, `label`): `AUniformBaseBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:44](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L44)


Initializes an AUniformBaseBuffer instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `MANAGED_STATE_KEY` | `string` | `undefined` | Managed state key |
| `usage` | `number` | `undefined` | GPU buffer usage flags |
| `data` | `ArrayBuffer` | `undefined` | Data to allocate to the buffer (`ArrayBuffer`) |
| `label` | `string` | `''` | Label for debugging (optional) |

#### Returns

`AUniformBaseBuffer`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`constructor`](ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L21)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L52)


Returns the cache key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`cacheKey`](ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:73](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L73)


Returns the buffer data (`ArrayBuffer`).

##### Returns

`ArrayBuffer`

***

### dataViewF32

#### Get Signature

> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L81)


Returns the buffer data as a `Float32Array` view.

##### Returns

`Float32Array`

***

### dataViewU32

#### Get Signature

> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:89](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L89)


Returns the buffer data as a `Uint32Array` view.

##### Returns

`Uint32Array`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L60)


Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`gpuBuffer`](ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`gpuDevice`](ABaseBuffer.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`name`](ABaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`redGPUContext`](ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`resourceManagerKey`](ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:97](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L97)


Returns the buffer size.

##### Returns

`number`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`size`](ABaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`targetResourceManagedState`](ABaseBuffer.md#targetresourcemanagedstate)

***

### uniformBufferDescriptor

#### Get Signature

> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L105)


Returns the `GPUBufferDescriptor`.

##### Returns

`GPUBufferDescriptor`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L68)


Returns the GPUBufferUsageFlags.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`usage`](ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`uuid`](ABaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L84)


Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`videoMemorySize`](ABaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__addDirtyPipelineListener`](ABaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__fireListenerList`](ABaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__removeDirtyPipelineListener`](ABaseBuffer.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/ABaseBuffer.ts#L92)


Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`destroy`](ABaseBuffer.md#destroy)

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:119](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/buffer/core/AUniformBaseBuffer.ts#L119)


Writes data to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Target uniform information (including View constructor and offset) |
| `value` | `any` | Value to write |

#### Returns

`void`
