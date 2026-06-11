[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / StorageBuffer

# Class: StorageBuffer

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/storageBuffer/StorageBuffer.ts#L18)

Class that manages storage buffers.

* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data);
```

## Extends

- [`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md)

## Constructors

### Constructor

> **new StorageBuffer**(`redGPUContext`, `uniformData`, `label?`, `cacheKey?`): `StorageBuffer`

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:41](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/storageBuffer/StorageBuffer.ts#L41)

Creates a StorageBuffer instance.

* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data, 'MyStorageBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `uniformData` | `ArrayBuffer` | `undefined` | `ArrayBuffer` data to upload |
| `label` | `string` | `''` | Buffer label (optional) |
| `cacheKey` | `string` | `''` | Buffer cache key (optional) |

#### Returns

`StorageBuffer`

#### Overrides

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#constructor)

## Properties


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L21)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_DATA_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_data_symbol)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_symbol)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`antialiasingManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L52)

Returns the cache key.

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`commandEncoderManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#commandencodermanager)

***

### data

#### Get Signature

> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:77](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L77)

Returns the buffer data (`ArrayBuffer`).

##### Returns

`ArrayBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`data`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#data)

***

### dataViewF32

#### Get Signature

> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:85](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L85)

Returns the buffer data as a `Float32Array` view.

##### Returns

`Float32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewF32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewf32)

***

### dataViewU32

#### Get Signature

> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:93](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L93)

Returns the buffer data as a `Uint32Array` view.

##### Returns

`Uint32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewU32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewu32)

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L60)

Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpudevice)

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:69](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L69)

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`label`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#label)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManager`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`revision`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#revision)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:101](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L101)

Returns the buffer size.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ManagementResourceBase.ts#L45)

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#targetresourcemanagedstate)

***

### uniformBufferDescriptor

#### Get Signature

> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:109](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L109)

Returns the `GPUBufferDescriptor`.

##### Returns

`GPUBufferDescriptor`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uniformBufferDescriptor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uniformbufferdescriptor)

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L68)

Returns the GPUBufferUsageFlags.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L84)

Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L89)

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

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

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

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/ABaseBuffer.ts#L92)

Destroys the resource.

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#destroy)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`notifyUpdate`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#notifyupdate)

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:123](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/buffer/core/AUniformBaseBuffer.ts#L123)

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


</details>
