[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexBuffer

# Class: VertexBuffer

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L19)


Class that manages vertex buffers.

* ### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct);
```

## Extends

- [`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md)

## Constructors

### Constructor

> **new VertexBuffer**(`redGPUContext`, `data`, `interleavedStruct`, `usage?`, `cacheKey?`): `VertexBuffer`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:71](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L71)


Creates a VertexBuffer instance.

* ### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct, GPUBufferUsage.VERTEX);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | Vertex data (`Array<number>` or `Float32Array`) |
| `interleavedStruct` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | `undefined` | Vertex data structure definition |
| `usage` | `number` | `...` | GPUBufferUsageFlags (default: `VERTEX | COPY_DST | STORAGE`) |
| `cacheKey` | `string` | `''` | Buffer cache key (optional) |

#### Returns

`VertexBuffer`

#### Overrides

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L24)


Internal buffer where vertex data is stored.

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L52)


Returns the cache key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:101](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L101)


Returns the vertex data.

##### Returns

`Float32Array`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L60)


Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpudevice)

***

### interleavedStruct

#### Get Signature

> **get** **interleavedStruct**(): [`VertexInterleavedStruct`](VertexInterleavedStruct.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:117](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L117)


Returns the vertex data structure.

##### Returns

[`VertexInterleavedStruct`](VertexInterleavedStruct.md)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L76)


Returns the size of the buffer in bytes.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#size)

***

### stride

#### Get Signature

> **get** **stride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:109](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L109)


Returns the stride (number of bytes per vertex).

##### Returns

`number`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#targetresourcemanagedstate)

***

### triangleCount

#### Get Signature

> **get** **triangleCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:133](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L133)


Returns the number of triangles.

##### Returns

`number`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L68)


Returns the GPUBufferUsageFlags.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#uuid)

***

### vertexCount

#### Get Signature

> **get** **vertexCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L125)


Returns the number of vertices.

##### Returns

`number`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L84)


Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L125)


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

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L152)


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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L137)


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

> **changeData**(`data`, `interleavedStruct?`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:153](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L153)


Changes the data of the vertex buffer.

* ### Example
```typescript
vertexBuffer.changeData(newData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | New vertex data (`Array<number>` or `Float32Array`) |
| `interleavedStruct?` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | Vertex data structure definition (optional) |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/core/ABaseBuffer.ts#L92)


Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#destroy)

***

### updateAllData()

> **updateAllData**(`data`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:216](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L216)


Re-uploads the entire data of the vertex buffer to the GPU.

* ### Example
```typescript
vertexBuffer.updateAllData(fullData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | New vertex data (`Array<number>` or `Float32Array`) |

#### Returns

`void`

***

### updateData()

> **updateData**(`data`, `offset?`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:197](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L197)


Updates part of the vertex buffer data starting from the offset.

* ### Example
```typescript
vertexBuffer.updateData(partialData, 1024);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | New vertex data (`Array<number>` or `Float32Array`) |
| `offset` | `number` | `0` | Update start offset (default: 0) |

#### Returns

`void`
