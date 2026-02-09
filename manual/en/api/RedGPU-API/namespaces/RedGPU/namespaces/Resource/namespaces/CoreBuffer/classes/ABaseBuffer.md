[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / ABaseBuffer

# Abstract Class: ABaseBuffer

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L21)


Abstract base class for all buffer resources used in RedGPU.

::: warning

This class is an abstract class and cannot be instantiated directly.<br/>Use it through inheritance.
:::

## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Extended by

- [`IndexBuffer`](../../../classes/IndexBuffer.md)
- [`VertexBuffer`](../../../classes/VertexBuffer.md)
- [`AUniformBaseBuffer`](AUniformBaseBuffer.md)

## Constructors

### Constructor

> `protected` **new ABaseBuffer**(`redGPUContext`, `managedStateKey`, `usage`): `ABaseBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:39](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L39)


Initializes an ABaseBuffer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `managedStateKey` | `string` | Managed state key |
| `usage` | `number` | GPU buffer usage flags |

#### Returns

`ABaseBuffer`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L23)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L22)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L52)


Returns the cache key.

##### Returns

`string`

#### Overrides

[`BRDFLUTTexture`](../../CoreIBL/classes/BRDFLUTTexture.md).[`cacheKey`](../../CoreIBL/classes/BRDFLUTTexture.md#cachekey)

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L60)


Returns the GPUBuffer object.

##### Returns

`GPUBuffer`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`BRDFLUTTexture`](../../CoreIBL/classes/BRDFLUTTexture.md).[`name`](../../CoreIBL/classes/BRDFLUTTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L76)


Returns the size of the buffer in bytes.

##### Returns

`number`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L68)


Returns the GPUBufferUsageFlags.

##### Returns

`number`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L84)


Returns the video memory usage in bytes.

##### Returns

`number`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../../Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/buffer/core/ABaseBuffer.ts#L92)


Destroys the resource.

#### Returns

`void`
