[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / Bloom

# Class: Bloom

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L33)

Next-generation HDR Bloom post-processing effect that implements physical light scattering based on a 5-stage mip-chain pyramid (13-Tap Dual-Grid downsample + 9-Tap Tent upsample), Soft-Knee HDR threshold, and Karis weighted average.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
view.builtInEffectManager.useBloom = true;
const bloom = view.builtInEffectManager.bloom;
bloom.setCinematic();
bloom.intensity = 0.8;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/bloom/" />

## See

[Bloom example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/bloom/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new Bloom**(`redGPUContext`): `Bloom`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:53](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L53)

Creates a Bloom instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`Bloom`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### intensity

#### Get Signature

> **get** **intensity**(): `number` = `0.675`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:138](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L138)

Returns or sets the final bloom composition intensity (0.0 ~ 10.0).

##### Returns

`number`

Bloom composition intensity

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:142](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L142)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxBrightness

#### Get Signature

> **get** **maxBrightness**(): `number` = `32.0`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:175](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L175)

Returns or sets the maximum HDR luminance clamp (1.0 ~ 200.0) to prevent specular firefly spikes.

##### Returns

`number`

Maximum HDR luminance clamp

#### Set Signature

> **set** **maxBrightness**(`value`): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:179](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L179)

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

> **get** **radius**(): `number` = `0.65`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:155](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L155)

Returns or sets the light scatter radius ratio (0.0 ~ 1.0) between mip levels.

##### Returns

`number`

Light scatter radius ratio

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:159](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L159)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### softKnee

#### Get Signature

> **get** **softKnee**(): `number` = `0.5`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:121](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L121)

Returns or sets the Soft-Knee quadratic curve ratio (0.0 ~ 1.0) in the threshold transition zone.

##### Returns

`number`

Soft-Knee ratio

#### Set Signature

> **set** **softKnee**(`value`): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### threshold

#### Get Signature

> **get** **threshold**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:104](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L104)

Returns or sets the linear HDR luminance threshold (0.0 ~ 20.0) where bloom begins.

##### Returns

`number`

Linear HDR luminance threshold

#### Set Signature

> **set** **threshold**(`value`): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:108](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L108)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tint

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tint**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:191](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L191)

Returns the bloom tint color filter object (`ColorRGB`).

##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Bloom tint `ColorRGB` instance

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L280)

Sequentially executes 5-stage mip-chain downsampling, 9-Tap Tent upsampling, and final HDR composition.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Input original HDR source texture information |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Final HDR texture information with bloom composited (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:212](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L212)

Applies a cinematic bloom preset providing wide and smooth highlight diffusion.

#### Returns

`void`

***

***

### setDreamy()

> **setDreamy**(): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:238](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L238)

Applies a dreamy bloom preset with an ethereal and soft-focus style.

#### Returns

`void`

***

***

### setNatural()

> **setNatural**(): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:199](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L199)

Applies the default natural physical camera bloom preset (`intensity = 0.675`) suitable for outdoor atmosphere and standard PBR scenes.

#### Returns

`void`

***

***

### setNeonGlow()

> **setNeonGlow**(): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:225](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L225)

Applies an intense neon glow preset for emissive neon signs, magic effects, and sci-fi scenes.

#### Returns

`void`

***

***

### setSubtle()

> **setSubtle**(): `void`

Defined in: [src/postEffect/builtIn/bloom/Bloom.ts:251](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/bloom/Bloom.ts#L251)

Applies a subtle specular glow preset for product configurators and architectural visualization.

#### Returns

`void`

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
