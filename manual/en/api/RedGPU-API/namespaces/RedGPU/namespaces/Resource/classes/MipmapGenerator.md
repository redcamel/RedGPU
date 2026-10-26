[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / MipmapGenerator

# Class: MipmapGenerator

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L20)

Utility class that automatically generates mipmaps for 2D textures via GPU render passes.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new MipmapGenerator**(`redGPUContext`): `MipmapGenerator`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L40)

Creates an instance of MipmapGenerator.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`MipmapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### createBindGroup()

> **createBindGroup**(`texture`, `textureView`, `useCache?`): `GPUBindGroup`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L121)

Creates or retrieves from cache the bind group to be used for the mipmap render pass.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | Target GPUTexture |
| `textureView` | `GPUTextureView` | `undefined` | Target GPUTextureView |
| `useCache?` | `boolean` | `false` | Whether to use persistent cache (default: false) |

#### Returns

`GPUBindGroup`

Created or cached GPUBindGroup

***

***

### createTextureView()

> **createTextureView**(`texture`, `baseMipLevel`, `baseArrayLayer`, `useCache?`): `GPUTextureView`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L66)

Creates or retrieves from cache the texture view for the specified mip level and layer.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | Target GPUTexture |
| `baseMipLevel` | `number` | `undefined` | Base mip level |
| `baseArrayLayer` | `number` | `undefined` | Base array layer |
| `useCache?` | `boolean` | `false` | Whether to use persistent cache (default: false) |

#### Returns

`GPUTextureView`

Created or cached GPUTextureView

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:376](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L376)

Releases all caches and mipmap generation pipeline resources.

#### Returns

`void`

***

***

### generateMipmap()

> **generateMipmap**(`texture`, `textureDescriptor`, `useCache?`, `encoderType?`): `GPUTexture`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L241)

Generates a mipmap chain for the input texture.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `texture` | `GPUTexture` | `undefined` | Source GPUTexture |
| `textureDescriptor` | `GPUTextureDescriptor` | `undefined` | Texture descriptor |
| `useCache?` | `boolean` | `false` | Whether to use persistent cache (default: false) |
| `encoderType?` | [`CommandEncoderType`](../../CommandEncoderManager/type-aliases/CommandEncoderType.md) | `COMMAND_ENCODER_TYPE.RESOURCE` | Command encoder type to use (default: COMMAND_ENCODER_TYPE.RESOURCE) |

#### Returns

`GPUTexture`

GPUTexture with generated mipmaps

***

***

### getMipmapPipeline()

> **getMipmapPipeline**(`format`): `GPURenderPipeline`

Defined in: [src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/mipmapGenerator/MipmapGenerator.ts#L178)

Returns the mipmap render pipeline corresponding to the specified texture format.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `format` | `GPUTextureFormat` | Target GPUTextureFormat |

#### Returns

`GPURenderPipeline`

Mipmap GPURenderPipeline

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
