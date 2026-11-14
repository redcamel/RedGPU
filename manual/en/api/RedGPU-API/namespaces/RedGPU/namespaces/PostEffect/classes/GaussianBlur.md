[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / GaussianBlur

# Class: GaussianBlur

Defined in: [src/postEffect/effects/blur/GaussianBlur.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/GaussianBlur.ts#L24)

Gaussian Blur post-processing effect that processes X and Y axis blurs in two separate passes (Separable Blur).

***

### Example
```typescript
const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
effect.size = 64;
view.postEffectManager.addEffect(effect);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/blur/gaussianBlur/" />

## See

[GaussianBlur example](https://redcamel.github.io/RedGPU/examples/postEffect/blur/gaussianBlur/)

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new GaussianBlur**(`redGPUContext`, `options?`): `GaussianBlur`

Defined in: [src/postEffect/effects/blur/GaussianBlur.ts:43](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/GaussianBlur.ts#L43)

Creates a GaussianBlur instance.

#### Example
```typescript
const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `options?` | \{ `isLdr?`: `boolean`; \} | Gaussian blur creation options. Defaults to LDR (`isLdr: true`, `rgba8unorm`), and exposes `isLdr: false` (`rgba16float`) in case it is used inside an HDR built-in pass (e.g., `LensFlare`). |
| `options.isLdr?` | `boolean` | - |

#### Returns

`GaussianBlur`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### size

#### Get Signature

> **get** **size**(): `number` = `32`

Defined in: [src/postEffect/effects/blur/GaussianBlur.ts:64](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/GaussianBlur.ts#L64)

Returns or sets the blur strength (unit: pixels, 0 ~ 512).

##### Returns

`number`

Blur strength

#### Set Signature

> **set** **size**(`value`): `void`

Defined in: [src/postEffect/effects/blur/GaussianBlur.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/GaussianBlur.ts#L68)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/effects/blur/GaussianBlur.ts:96](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/GaussianBlur.ts#L96)

Renders the horizontal/vertical 2-pass Gaussian blur effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | Input source texture information |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Result texture information with Gaussian blur applied (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L14)

Whether the instance is a post-processing effect

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#commandencodermanager)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/AMultiPassPostEffect.md#gpudevice)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`instanceId`](../namespaces/Core/classes/AMultiPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L68)

Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.

##### Returns

`boolean`

Whether the effect operates in LDR space

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isLdr`](../namespaces/Core/classes/AMultiPassPostEffect.md#isldr)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`name`](../namespaces/Core/classes/AMultiPassPostEffect.md#name)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): ([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L93)

Returns the array of registered internal single-pass effects.

##### Returns

([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Array of internal single-pass post effects (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#resourcemanager)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uuid`](../namespaces/Core/classes/AMultiPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L80)

Returns the sum of video memory usage (in bytes) of all internal passes.

##### Returns

`number`

Video memory usage (unit: bytes)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L115)

Clears cached resources of all registered internal passes.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L101)

Destroys all internal pass effects and allocated resources.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`destroy`](../namespaces/Core/classes/AMultiPassPostEffect.md#destroy)

***

</details>
