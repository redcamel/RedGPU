[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / SSAO

# Class: SSAO

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L34)

SSAO post-processing effect that generates high-quality screen-space ambient occlusion shadows based on Ground Truth Ambient Occlusion (GTAO), Edge-Stopping Bilateral Denoiser, and Multi-Bounce.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable and configure SSAO through View3D's builtInEffectManager
view.builtInEffectManager.useSSAO = true;
const ssao = view.builtInEffectManager.ssao;
ssao.radius = 0.5;
ssao.intensity = 1.5;
ssao.useMultiBounce = true;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/" />

## See

[SSAO example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new SSAO**(`redGPUContext`): `SSAO`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L49)

Creates an SSAO instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`SSAO`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### bias

#### Get Signature

> **get** **bias**(): `number` = `0.01`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:140](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L140)

Returns or sets the depth bias value (0.0 ~ 0.1) to prevent self-occlusion artifacts.

##### Returns

`number`

Depth bias

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:144](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L144)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### biasDistanceScale

#### Get Signature

> **get** **biasDistanceScale**(): `number` = `0.01`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:157](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L157)

Returns or sets the bias scale factor (0.0 ~ 0.5) applied proportionally to camera distance.

##### Returns

`number`

Bias distance scale

#### Set Signature

> **set** **biasDistanceScale**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L161)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### contrast

#### Get Signature

> **get** **contrast**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:208](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L208)

Returns or sets the contrast (0.5 ~ 4.0) of the AO shadow.

##### Returns

`number`

Contrast value

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:212](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L212)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeDistanceRange

#### Get Signature

> **get** **fadeDistanceRange**(): `number` = `50.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:191](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L191)

Returns or sets the fade distance range (1.0 ~ 100.0) over which the AO effect completely fades out.

##### Returns

`number`

Fade distance range

#### Set Signature

> **set** **fadeDistanceRange**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:195](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeDistanceStart

#### Get Signature

> **get** **fadeDistanceStart**(): `number` = `30.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:174](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L174)

Returns or sets the camera distance (1.0 ~ 200.0) at which the AO effect starts to fade out.

##### Returns

`number`

Fade start distance

#### Set Signature

> **set** **fadeDistanceStart**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:178](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### intensity

#### Get Signature

> **get** **intensity**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:123](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L123)

Returns or sets the intensity (0 ~ 10) of the AO shadow.

##### Returns

`number`

AO intensity

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:127](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L127)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### radius

#### Get Signature

> **get** **radius**(): `number` = `0.5`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:106](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L106)

Returns or sets the sampling radius in world units (0.01 ~ 5.0) for occlusion calculation.

##### Returns

`number`

Sampling radius

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:110](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L110)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useBlur

#### Get Signature

> **get** **useBlur**(): `boolean` = `true`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:72](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L72)

Returns or sets whether the Edge-Stopping Bilateral denoiser pass that preserves depth and normal edges is used.

##### Returns

`boolean`

Whether denoiser blur is used

#### Set Signature

> **set** **useBlur**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:76](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L76)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useMultiBounce

#### Get Signature

> **get** **useMultiBounce**(): `boolean` = `true`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L89)

Returns or sets whether GTAO Multi-Bounce, which preserves albedo color saturation in occluded creases, is applied.

##### Returns

`boolean`

Whether Multi-Bounce is applied

#### Set Signature

> **set** **useMultiBounce**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:237](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L237)

Renders the multi-pass SSAO post-processing effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Original source texture information |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Post-effect result with SSAO composited (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L14)

Whether the instance is a post-processing effect

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../../Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../../Core/classes/AMultiPassPostEffect.md#commandencodermanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../../Core/classes/AMultiPassPostEffect.md#gpudevice)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`instanceId`](../../Core/classes/AMultiPassPostEffect.md#instanceid)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isLdr`](../../Core/classes/AMultiPassPostEffect.md#isldr)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`name`](../../Core/classes/AMultiPassPostEffect.md#name)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): ([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L93)

Returns the array of registered internal single-pass effects.

##### Returns

([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

Array of internal single-pass post effects (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`passList`](../../Core/classes/AMultiPassPostEffect.md#passlist)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../../Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../../Core/classes/AMultiPassPostEffect.md#resourcemanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`uuid`](../../Core/classes/AMultiPassPostEffect.md#uuid)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../../Core/classes/AMultiPassPostEffect.md#videomemorysize)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`clear`](../../Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L101)

Destroys all internal pass effects and allocated resources.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`destroy`](../../Core/classes/AMultiPassPostEffect.md#destroy)

***

</details>
