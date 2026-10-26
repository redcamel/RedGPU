[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DirectCubeTexture

# Class: DirectCubeTexture

Defined in: [src/resources/texture/DirectCubeTexture.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L19)

Multi-dimensional (Cube and 3D) texture class that directly receives and manages an external `GPUTexture` without loading from file URLs.

***

### Example
```typescript
const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'custom_cube_key', gpuTexture);
```

## Extends

- `ADirectTexture`

## Constructors



***

### Constructor

> **new DirectCubeTexture**(`redGPUContext`, `cacheKey`, `gpuTexture?`): `DirectCubeTexture`

Defined in: [src/resources/texture/DirectCubeTexture.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L41)

Creates a DirectCubeTexture instance. Returns the existing cached instance if the same `cacheKey` exists.

#### Example
```typescript
const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'my_cube_texture', gpuTexture);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `cacheKey` | `string` | Unique key for resource identification and caching |
| `gpuTexture?` | `GPUTexture` | `GPUTexture` object to inject directly (optional) |

#### Returns

`DirectCubeTexture`

#### Overrides

`ADirectTexture.constructor`

## Accessors



***

### viewDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewDescriptor**(): `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/DirectCubeTexture.ts:67](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L67)

Returns the `GPUTextureViewDescriptor` reflecting the texture dimension (`cube` or `3d`) and mipmap levels.

##### Returns

`GPUTextureViewDescriptor`

`GPUTextureViewDescriptor` object

#### Overrides

`ADirectTexture.viewDescriptor`

## Methods



***

### registerResource()

> `protected` **registerResource**(): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L94)

Registers the cube texture state in the resource manager.

#### Returns

`void`

#### Overrides

`ADirectTexture.registerResource`

***

***

### setGpuTexture()

> `protected` **setGpuTexture**(`value`): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L85)

Sets the `GPUTexture` object and updates dimension information and view.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUTexture` | `GPUTexture` object to set |

#### Returns

`void`

#### Overrides

`ADirectTexture.setGpuTexture`

***

***

### unregisterResource()

> `protected` **unregisterResource**(): `void`

Defined in: [src/resources/texture/DirectCubeTexture.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/DirectCubeTexture.ts#L102)

Unregisters the cube texture from the resource manager.

#### Returns

`void`

#### Overrides

`ADirectTexture.unregisterResource`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

`ADirectTexture.antialiasingManager`

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`ADirectTexture.cacheKey`

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

`ADirectTexture.commandEncoderManager`

***

***

### format

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **format**(): `GPUTextureFormat`

Defined in: [src/resources/texture/core/ADirectTexture.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L80)

Returns the GPU texture format.

##### Returns

`GPUTextureFormat`

#### Inherited from

`ADirectTexture.format`

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

`ADirectTexture.gpuDevice`

***

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/core/ADirectTexture.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L52)

Gets or sets the internal WebGPU texture instance.

##### Returns

`GPUTexture`

#### Set Signature

> **set** **gpuTexture**(`value`): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L56)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTexture` |

##### Returns

`void`

#### Inherited from

[`DirectTexture`](DirectTexture.md).[`gpuTexture`](DirectTexture.md#gputexture)

***

***

### gpuTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTextureView**(): `GPUTextureView`

Defined in: [src/resources/texture/core/ADirectTexture.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L64)

Returns the internal WebGPU texture view.

##### Returns

`GPUTextureView`

#### Inherited from

`ADirectTexture.gpuTextureView`

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

`ADirectTexture.instanceId`

***

***

### mipLevelCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L88)

Returns the number of mip levels of the texture.

##### Returns

`number`

#### Inherited from

`ADirectTexture.mipLevelCount`

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

`ADirectTexture.redGPUContext`

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

`ADirectTexture.resourceManager`

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

`ADirectTexture.resourceManagerKey`

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

`ADirectTexture.revision`

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Resource managed status info object

#### Inherited from

`ADirectTexture.targetResourceManagedState`

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

`ADirectTexture.uuid`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/core/ADirectTexture.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L72)

Returns the video memory size of the texture in bytes.

##### Returns

`number`

#### Inherited from

`ADirectTexture.videoMemorySize`

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

`ADirectTexture.__addDirtyPipelineListener`

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

`ADirectTexture.__removeDirtyPipelineListener`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/ADirectTexture.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/core/ADirectTexture.ts#L96)

Destroys the texture resource and releases video memory.

#### Returns

`void`

#### Inherited from

`ADirectTexture.destroy`

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

`ADirectTexture.notifyUpdate`

***

</details>
