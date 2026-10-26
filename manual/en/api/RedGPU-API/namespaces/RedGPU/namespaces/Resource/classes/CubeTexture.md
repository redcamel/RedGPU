[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / CubeTexture

# Class: CubeTexture

Defined in: [src/resources/texture/CubeTexture.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L35)

Class that loads 6 face (+X, -X, +Y, -Y, +Z, -Z) images and manages them as a GPU cubemap (`cube`) texture.

***

### Example
```typescript
const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    'right.png', 'left.png',
    'top.png', 'bottom.png',
    'front.png', 'back.png'
]);
```

## See

- [SkyBox basic example](https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/)
 - [SkyBox transition example](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransition/)

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors



***

### Constructor

> **new CubeTexture**(`redGPUContext`, `srcList`, `useMipMap?`, `onLoad?`, `onError?`, `format?`): `CubeTexture`

Defined in: [src/resources/texture/CubeTexture.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L92)

Creates a CubeTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.

#### Example
```typescript
const cubeTexture = new RedGPU.Resource.CubeTexture(
    redGPUContext,
    ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
    true,
    (loadedTexture) => {
        console.log('CubeTexture loaded:', loadedTexture);
    }
);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `srcList` | [`CubeSrcInfo`](../type-aliases/CubeSrcInfo.md) | `undefined` | 6-face cube texture source information (array of URLs or object with cache key) |
| `useMipMap?` | `boolean` | `true` | Whether to generate mipmaps (default: `true`) |
| `onLoad?` | (`cubeTextureInstance?`) => `void` | `undefined` | Callback function called when loading completes |
| `onError?` | (`error`) => `void` | `undefined` | Callback function called when loading fails |
| `format?` | `GPUTextureFormat` | `undefined` | GPU texture pixel format (default: preferred canvas format with `-srgb`) |

#### Returns

`CubeTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Properties



***

### defaultViewDescriptor

> `static` **defaultViewDescriptor**: `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/CubeTexture.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L40)

Default `GPUTextureViewDescriptor` configuration for cube textures.

## Accessors



***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/CubeTexture.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L156)

Returns the created `GPUTexture` instance.

##### Returns

`GPUTexture`

`GPUTexture` instance

***

***

### mipLevelCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L168)

Returns the number of generated mipmap levels.

##### Returns

`number`

Number of mipmap levels

***

***

### srcList

#### Get Signature

> **get** **srcList**(): `string`[]

Defined in: [src/resources/texture/CubeTexture.ts:180](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L180)

Gets or sets the array of 6-face image source paths. Changing this value reloads the cube texture asynchronously.

##### Returns

`string`[]

Array of image source paths (`string[]`)

#### Set Signature

> **set** **srcList**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L184)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`CubeSrcInfo`](../type-aliases/CubeSrcInfo.md) |

##### Returns

`void`

***

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/CubeTexture.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L198)

Gets or sets whether mipmaps are used. Changing this value recreates the texture.

##### Returns

`boolean`

Whether mipmaps are used

#### Set Signature

> **set** **useMipmap**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L202)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L144)

Returns the video memory size in bytes occupied by the texture.

##### Returns

`number`

Video memory usage in bytes

***

***

### viewDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewDescriptor**(): `object`

Defined in: [src/resources/texture/CubeTexture.ts:129](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L129)

Returns the `GPUTextureViewDescriptor` object reflecting the current mipmap level count.

##### Returns

`GPUTextureViewDescriptor` object

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `arrayLayerCount?` | `number` | How many array layers, starting with GPUTextureViewDescriptor#baseArrayLayer, are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1849 |
| `aspect?` | `GPUTextureAspect` | Which GPUTextureAspect \| aspect(s) of the texture are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1831 |
| `baseArrayLayer?` | `number` | The index of the first array layer accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1844 |
| `baseMipLevel?` | `number` | The first (most detailed) mipmap level accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1835 |
| `dimension?` | `GPUTextureViewDimension` | The dimension to view the texture as. | node\_modules/@webgpu/types/dist/index.d.ts:1818 |
| `format?` | `GPUTextureFormat` | The format of the texture view. Must be either the GPUTextureDescriptor#format of the texture or one of the GPUTextureDescriptor#viewFormats specified during its creation. | node\_modules/@webgpu/types/dist/index.d.ts:1814 |
| `label?` | `string` | The initial value of GPUObjectBase#label \| GPUObjectBase.label. | node\_modules/@webgpu/types/dist/index.d.ts:1062 |
| `mipLevelCount` | `number` | - | [src/resources/texture/CubeTexture.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L132) |
| `swizzle?` | `string` | A string of length four, with each character mapping to the texture view's red/green/blue/alpha channels, respectively. When accessed by a shader, the red/green/blue/alpha channels are replaced by the value corresponding to the component specified in `swizzle[0]`, `swizzle[1]`, `swizzle[2]`, and `swizzle[3]`, respectively: - `"r"`: Take its value from the red channel of the texture. - `"g"`: Take its value from the green channel of the texture. - `"b"`: Take its value from the blue channel of the texture. - `"a"`: Take its value from the alpha channel of the texture. - `"0"`: Force its value to 0. - `"1"`: Force its value to 1. Requires the GPUFeatureName `"texture-component-swizzle"` feature to be enabled. | node\_modules/@webgpu/types/dist/index.d.ts:1864 |
| `usage?` | `number` | The allowed GPUTextureUsage \| usage(s) for the texture view. Must be a subset of the GPUTexture#usage flags of the texture. If 0, defaults to the full set of GPUTexture#usage flags of the texture. Note: If the view's GPUTextureViewDescriptor#format doesn't support all of the texture's GPUTextureDescriptor#usages, the default will fail, and the view's GPUTextureViewDescriptor#usage must be specified explicitly. | node\_modules/@webgpu/types/dist/index.d.ts:1827 |

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/CubeTexture.ts:212](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L212)

Releases the texture GPU resource and unregisters it from the resource manager.

#### Returns

`void`

***

***

### setGPUTextureDirectly()

> **setGPUTextureDirectly**(`gpuTexture`, `cacheKey?`, `useMipmap?`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:238](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/CubeTexture.ts#L238)

Directly injects and sets an externally created `GPUTexture` object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuTexture` | `GPUTexture` | `undefined` | `GPUTexture` object to set |
| `cacheKey?` | `string` | `undefined` | Cache key (uses UUID-based key if omitted) |
| `useMipmap?` | `boolean` | `true` | Whether to use mipmaps (default: `true`) |

#### Returns

`void`

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

[`OctahedralImpostorMaterial`](../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md).[`cacheKey`](../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md#cachekey)

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

***

</details>
