[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / PostEffectTexturePool

# Class: PostEffectTexturePool

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L24)

Texture pool class that reuses temporary textures generated during post-processing to reduce video memory occupancy and allocation overhead.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via View3D's postEffectManager
const texturePool = view.postEffectManager.texturePool;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PostEffectTexturePool**(`redGPUContext`): `PostEffectTexturePool`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L45)

Creates a PostEffectTexturePool instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PostEffectTexturePool`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### activeCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L81)

Returns the number of currently active textures.

##### Returns

`number`

Active texture count

***

***

### allocationCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocationCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L119)

Returns the total number of newly allocated textures.

##### Returns

`number`

Total allocation count

***

***

### hitRate

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hitRate**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L131)

Returns the texture reuse hit rate (0 ~ 1).

##### Returns

`number`

Hit rate (0 ~ 1)

***

***

### idleCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **idleCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L93)

Returns the number of idle textures waiting in the pool.

##### Returns

`number`

Idle texture count

***

***

### peakActiveCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **peakActiveCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:107](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L107)

Returns the historical peak number of concurrently active textures.

##### Returns

`number`

Peak active texture count

***

***

### totalCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L69)

Returns the total number of textures in the pool (active + idle).

##### Returns

`number`

Total texture count

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L57)

Returns the total video memory usage (in bytes) in the pool.

##### Returns

`number`

Video memory usage (unit: bytes)

## Methods



***

### allocResult()

> **allocResult**(`width`, `height`, `format?`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:175](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L175)

Retrieves a texture of the specified size and format from the pool or allocates a new one.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `width` | `number` | `undefined` | Texture width (in pixels) |
| `height` | `number` | `undefined` | Texture height (in pixels) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | Texture format |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Allocated texture and view result object (`IPostEffectResult`)

***

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:216](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L216)

Destroys all textures in the pool and resets statistics.

#### Returns

`void`

***

***

### getDetails()

> **getDetails**(): `any`[]

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L144)

Returns the detailed status list of the texture pool by resolution and format key.

#### Returns

`any`[]

Array of detailed pool status objects

***

***

### release()

> **release**(`texture`): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L188)

Releases a specific texture back to the pool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | `GPUTexture` instance to release |

#### Returns

`void`

***

***

### releaseAll()

> **releaseAll**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/PostEffectTexturePool.ts#L202)

Releases all currently active textures back to the pool.

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
