[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:35](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L35)

Class that manages the post-processing pipeline and user post-processing effect list of a `View3D`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via View3D's postEffectManager
const postEffectManager = view.postEffectManager;
postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PostEffectManager**(`view`): `PostEffectManager`

Defined in: [src/postEffect/PostEffectManager.ts:85](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L85)

Creates a PostEffectManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to bind |

#### Returns

`PostEffectManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### effectList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **effectList**(): ([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L161)

Returns the array of registered user post-processing effects.

##### Returns

([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Array of post-processing effects (`Array<ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect>`)

***

***

### gbufferBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gbufferBindGroup**(): `GPUBindGroup`

Defined in: [src/postEffect/PostEffectManager.ts:113](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L113)

Returns the shared G-Buffer bind group for the current swap buffer index.

##### Returns

`GPUBindGroup`

Shared G-Buffer `GPUBindGroup`

***

***

### gbufferBindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gbufferBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/postEffect/PostEffectManager.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L101)

Returns the shared G-Buffer bind group layout.

##### Returns

`GPUBindGroupLayout`

G-Buffer `GPUBindGroupLayout`

***

***

### postEffectSystemUniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L137)

Returns the post-effect system common uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

System `UniformBuffer` instance

***

***

### texturePool

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **texturePool**(): [`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Defined in: [src/postEffect/PostEffectManager.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L125)

Returns the post-effect texture pool instance.

##### Returns

[`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

`PostEffectTexturePool` instance

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/PostEffectManager.ts:173](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L173)

Returns the total video memory usage (in bytes) of the texture pool and registered effects.

##### Returns

`number`

Video memory usage (unit: bytes)

***

***

### view

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L149)

Returns the bound `View3D` instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` instance

## Methods



***

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:214](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L214)

Adds an effect to the post-processing pipeline.

#### Example
```typescript
view.postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | Post-processing effect instance to add |

#### Returns

`void`

***

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:385](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L385)

Clears cached resources of all registered effects and the texture pool.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L182)

Destroys all registered post-processing effects, texture pool, and system buffers.

#### Returns

`void`

***

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L232)

Returns the post-processing effect at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index to retrieve |

#### Returns

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Post-processing effect instance at the specified index

***

***

### removeAllEffect()

> **removeAllEffect**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:271](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L271)

Removes all registered post-processing effects and clears their resources.

#### Returns

`void`

***

***

### removeEffect()

> **removeEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L244)

Removes a specific post-processing effect from the pipeline and clears its resources.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | Post-processing effect instance to remove |

#### Returns

`void`

***

***

### removeEffectAt()

> **removeEffectAt**(`index`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:260](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L260)

Removes the post-processing effect at the specified index from the pipeline and clears its resources.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the effect to remove |

#### Returns

`void`

***

***

### render()

> **render**(): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/PostEffectManager.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L287)

Executes the entire post-processing pipeline and returns the final output texture information.

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Final rendering result texture information (`IPostEffectResult`)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

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

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
