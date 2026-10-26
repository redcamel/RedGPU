[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / BitmapTexture

# Class: BitmapTexture

Defined in: [src/resources/texture/BitmapTexture.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L37)

Class that loads standard images (PNG, JPG, WebP, SVG) and KTX2 compressed textures and manages them as GPU 2D textures.

***

### Example
```typescript
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/image.png');
```

## See

- [BitmapTexture Sampler example](https://redcamel.github.io/RedGPU/examples/3d/texture/bitmapTextureSampler/)
 - [BitmapMaterial example](https://redcamel.github.io/RedGPU/examples/3d/material/bitmapMaterial/)
 - [KTX2 basic example](https://redcamel.github.io/RedGPU/examples/3d/texture/ktx2/basic/)

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors



***

### Constructor

> **new BitmapTexture**(`redGPUContext`, `src?`, `useMipMap?`, `onLoad?`, `onError?`, `format?`, `usePremultiplyAlpha?`): `BitmapTexture`

Defined in: [src/resources/texture/BitmapTexture.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L90)

Creates a BitmapTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.

#### Example
```typescript
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'assets/diffuse.png',
    true,
    (loadedTexture) => {
        console.log('Loaded:', loadedTexture);
    }
);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `src?` | [`BitmapSrcInfo`](../type-aliases/BitmapSrcInfo.md) | `undefined` | Texture source path or information including cache key |
| `useMipMap?` | `boolean` | `true` | Whether to generate mipmaps (default: `true`) |
| `onLoad?` | (`textureInstance?`) => `void` | `undefined` | Callback function called when loading completes |
| `onError?` | (`error`) => `void` | `undefined` | Callback function called when loading fails |
| `format?` | `GPUTextureFormat` | `undefined` | GPU texture pixel format (default: preferred canvas format with `-srgb`) |
| `usePremultiplyAlpha?` | `boolean` | `false` | Whether to apply premultiplied alpha (default: `false`) |

#### Returns

`BitmapTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Accessors



***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/BitmapTexture.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L179)

Returns the created `GPUTexture` instance.

##### Returns

`GPUTexture`

`GPUTexture` instance

***

***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/resources/texture/BitmapTexture.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L143)

Returns the height of the texture in pixels.

##### Returns

`number`

Height in pixels

***

***

### mipLevelCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/BitmapTexture.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L191)

Returns the number of generated mipmap levels.

##### Returns

`number`

Number of mipmap levels

***

***

### src

#### Get Signature

> **get** **src**(): `string`

Defined in: [src/resources/texture/BitmapTexture.ts:203](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L203)

Gets or sets the texture source path. Changing this value reloads the texture from the new path asynchronously.

##### Returns

`string`

Texture source path string

#### Set Signature

> **set** **src**(`value`): `void`

Defined in: [src/resources/texture/BitmapTexture.ts:219](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L219)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`BitmapSrcInfo`](../type-aliases/BitmapSrcInfo.md) |

##### Returns

`void`

***

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/BitmapTexture.ts:215](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L215)

Gets or sets whether mipmaps are used. Changing this value recreates the texture.

##### Returns

`boolean`

Whether mipmaps are used

#### Set Signature

> **set** **useMipmap**(`value`): `void`

Defined in: [src/resources/texture/BitmapTexture.ts:247](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L247)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### usePremultiplyAlpha

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **usePremultiplyAlpha**(): `boolean`

Defined in: [src/resources/texture/BitmapTexture.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L155)

Returns whether premultiplied alpha is used.

##### Returns

`boolean`

Whether premultiplied alpha is used

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/BitmapTexture.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L167)

Returns the video memory size in bytes occupied by the texture.

##### Returns

`number`

Video memory usage in bytes

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/resources/texture/BitmapTexture.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L131)

Returns the width of the texture in pixels.

##### Returns

`number`

Width in pixels

## Methods



***

### addLoadListeners()

> **addLoadListeners**(`onLoad?`, `onError?`): `void`

Defined in: [src/resources/texture/BitmapTexture.ts:236](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L236)

Adds texture load complete and error event listeners. If already loaded or failed, invoked immediately via microtask.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onLoad?` | (`textureInstance`) => `void` | Load complete callback function |
| `onError?` | (`error`) => `void` | Error callback function |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/BitmapTexture.ts:257](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/BitmapTexture.ts#L257)

Releases the texture GPU resource and unregisters it from the resource manager.

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`cacheKey`](../namespaces/Core/classes/ManagementResourceBase.md#cachekey)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ManagementResourceBase.md#commandencodermanager)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`instanceId`](../namespaces/Core/classes/ManagementResourceBase.md#instanceid)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`name`](../namespaces/Core/classes/ManagementResourceBase.md#name)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanager)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`revision`](../namespaces/Core/classes/ManagementResourceBase.md#revision)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

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

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ManagementResourceBase.md#notifyupdate)

</details>
