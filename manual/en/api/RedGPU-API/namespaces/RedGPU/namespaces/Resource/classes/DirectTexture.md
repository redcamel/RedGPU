[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DirectTexture

# Class: DirectTexture

Defined in: [src/resources/texture/DirectTexture.ts:13](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/DirectTexture.ts#L13)

2D-specific texture class that directly injects and manages GPUTexture without loading from file paths (URLs).

## Extends

- `ADirectTexture`

## Constructors

### Constructor

> **new DirectTexture**(`redGPUContext`, `cacheKey`, `gpuTexture?`): `DirectTexture`

Defined in: [src/resources/texture/DirectTexture.ts:22](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/DirectTexture.ts#L22)

Creates a DirectTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 |
| `cacheKey` | `string` | 캐시 키 (동일 키 존재 시 기존 인스턴스 반환) |
| `gpuTexture?` | `GPUTexture` | 외부 GPUTexture 주입 (선택) |

#### Returns

`DirectTexture`

#### Overrides

`ADirectTexture.constructor`

## Accessors

### viewDescriptor

#### Get Signature

> **get** **viewDescriptor**(): `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/DirectTexture.ts:45](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/DirectTexture.ts#L45)

Returns the view descriptor.

##### Returns

`GPUTextureViewDescriptor`

- GPUTextureViewDescriptor object

#### Overrides

`ADirectTexture.viewDescriptor`

## Methods

### registerResource()

> `protected` **registerResource**(): `void`

Defined in: [src/resources/texture/DirectTexture.ts:57](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/DirectTexture.ts#L57)

#### Returns

`void`

#### Overrides

`ADirectTexture.registerResource`

***

### unregisterResource()

> `protected` **unregisterResource**(): `void`

Defined in: [src/resources/texture/DirectTexture.ts:61](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/DirectTexture.ts#L61)

#### Returns

`void`

#### Overrides

`ADirectTexture.unregisterResource`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

`ADirectTexture.antialiasingManager`

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L53)

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L61)

Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`ADirectTexture.cacheKey`

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

`ADirectTexture.commandEncoderManager`

***

### format

#### Get Signature

> **get** **format**(): `GPUTextureFormat`

Defined in: [src/resources/texture/core/ADirectTexture.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L40)

##### Returns

`GPUTextureFormat`

#### Inherited from

`ADirectTexture.format`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

`ADirectTexture.gpuDevice`

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/core/ADirectTexture.ts:24](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L24)

##### Returns

`GPUTexture`

#### Set Signature

> **set** **gpuTexture**(`value`): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:28](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L28)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTexture` |

##### Returns

`void`

#### Inherited from

`ADirectTexture.gpuTexture`

***

### gpuTextureView

#### Get Signature

> **get** **gpuTextureView**(): `GPUTextureView`

Defined in: [src/resources/texture/core/ADirectTexture.ts:32](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L32)

##### Returns

`GPUTextureView`

#### Inherited from

`ADirectTexture.gpuTextureView`

***

### mipLevelCount

#### Get Signature

> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:44](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L44)

##### Returns

`number`

#### Inherited from

`ADirectTexture.mipLevelCount`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

`ADirectTexture.name`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

`ADirectTexture.redGPUContext`

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

`ADirectTexture.resourceManager`

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

`ADirectTexture.resourceManagerKey`

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

`ADirectTexture.revision`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ManagementResourceBase.ts#L45)

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

`ADirectTexture.targetResourceManagedState`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

`ADirectTexture.uuid`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:36](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L36)

##### Returns

`number`

#### Inherited from

`ADirectTexture.videoMemorySize`

***

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L89)

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

`ADirectTexture.__addDirtyPipelineListener`

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

`ADirectTexture.__removeDirtyPipelineListener`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:49](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L49)

Destroys the resource.

#### Returns

`void`

#### Inherited from

`ADirectTexture.destroy`

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

`ADirectTexture.notifyUpdate`

***

### setGpuTexture()

> `protected` **setGpuTexture**(`value`): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:61](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/core/ADirectTexture.ts#L61)

Sets the GPUTexture object and synchronizes internal state.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTexture` |

#### Returns

`void`

#### Inherited from

`ADirectTexture.setGpuTexture`

***


</details>
