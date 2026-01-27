[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IndexBuffer

# Class: IndexBuffer

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L19)


Class that manages index buffers.

* ### Example
```typescript
const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2]);
```

## Extends

- [`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md)

## Constructors

### Constructor

> **new IndexBuffer**(`redGPUContext`, `data`, `usage`, `cacheKey`): `IndexBuffer`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:59](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L59)


Creates an IndexBuffer instance.

* ### Example
```typescript
const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2], GPUBufferUsage.INDEX, 'MyIndexBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `data` | `NumberArray` | `undefined` | Index data (`Array<number>` or `Uint32Array`) |
| `usage` | `number` | `...` | GPUBufferUsageFlags (default: `GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST`) |
| `cacheKey` | `string` | `''` | Buffer cache key (optional) |

#### Returns

`IndexBuffer`

#### Overrides

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `Uint32Array`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L24)


Internal buffer where index data is stored.

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L52)


Returns the cache key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `NumberArray`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:108](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L108)


Returns the index data.

##### Returns

`NumberArray`

***

### format

#### Get Signature

> **get** **format**(): `GPUIndexFormat`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L84)


Returns the GPU index format.

##### Returns

`GPUIndexFormat`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L60)


Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpudevice)

***

### indexCount

#### Get Signature

> **get** **indexCount**(): `number`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:100](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L100)


Returns the number of indices.

##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L76)


Returns the size of the buffer in bytes.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#targetresourcemanagedstate)

***

### triangleCount

#### Get Signature

> **get** **triangleCount**(): `number`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L92)


Returns the number of triangles.

##### Returns

`number`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L68)


Returns the GPUBufferUsageFlags.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L84)


Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__fireListenerList`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__removedirtypipelinelistener)

***

### changeData()

> **changeData**(`data`): `void`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:125](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/indexBuffer/IndexBuffer.ts#L125)


Changes the data of the index buffer.

* ### Example
```typescript
indexBuffer.changeData([3, 4, 5]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `NumberArray` | New index data (`Array<number>` or `Uint32Array`) |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/buffer/core/ABaseBuffer.ts#L92)


Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#destroy)
