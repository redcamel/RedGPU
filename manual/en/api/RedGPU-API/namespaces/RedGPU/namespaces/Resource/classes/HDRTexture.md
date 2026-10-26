[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / HDRTexture

# Class: HDRTexture

Defined in: [src/resources/texture/hdr/HDRTexture.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L29)

2D texture class that uses Radiance HDR (.hdr) files.

Loads .hdr files to create a 2D GPUTexture in rgba16float format. Used as source data for lightmaps, projected textures, or IBL.

***

### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors



***

### Constructor

> **new HDRTexture**(`redGPUContext`, `src`, `onLoad?`, `onError?`): `HDRTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L64)

Creates an HDRTexture instance.

#### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
    console.log('Loaded:', v);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `src` | [`HDRSrcInfo`](../type-aliases/HDRSrcInfo.md) | HDR file path or information |
| `onLoad?` | (`textureInstance?`) => `void` | Load complete callback |
| `onError?` | (`error`) => `void` | Error callback |

#### Returns

`HDRTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Accessors



***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L136)

Returns the GPUTexture object.

##### Returns

`GPUTexture`

GPUTexture instance

***

***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L112)

Returns the texture height.

##### Returns

`number`

Height in pixels

***

***

### src

#### Get Signature

> **get** **src**(): `string`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L148)

Returns the texture source path.

##### Returns

`string`

Source path

#### Set Signature

> **set** **src**(`value`): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L160)

Sets the texture source path and starts loading.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`HDRSrcInfo`](../type-aliases/HDRSrcInfo.md) | Source info to set |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L124)

Returns the video memory usage in bytes.

##### Returns

`number`

Video memory usage in bytes

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L100)

Returns the texture width.

##### Returns

`number`

Width in pixels

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/hdr/HDRTexture.ts#L172)

Destroys the texture resource.

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ManagementResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`cacheKey`](../namespaces/Core/classes/ManagementResourceBase.md#cachekey)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ManagementResourceBase.md#commandencodermanager)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`instanceId`](../namespaces/Core/classes/ManagementResourceBase.md#instanceid)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`name`](../namespaces/Core/classes/ManagementResourceBase.md#name)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanager)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`revision`](../namespaces/Core/classes/ManagementResourceBase.md#revision)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ManagementResourceBase.md#notifyupdate)

</details>
