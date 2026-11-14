[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/builtIn/dof/DOF.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L44)

Next-generation Physical Bokeh Depth of Field (DOF) post-processing effect featuring 35mm full-frame sensor (`sensorSize = 24mm`) geometric Thin-Lens Circle of Confusion (CoC), CoC-Aware bilateral 3-level mip chain (`Mip 0 ~ Mip 2`), dilated Tile Max CoC (`DOFTileMaxCoC`), foreground/background Dual-Buffer polygonal gathering, and full-resolution Slight Out-of-Focus 8-Tap direct gathering & Recombine.

Automatically activated by the system when setting `builtInEffectManager.useDOF` of `View3D` to `true`, and camera lens parameters and presets are controlled via `view.builtInEffectManager.dof`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable DOF and apply a preset through View3D's builtInEffectManager
view.builtInEffectManager.useDOF = true;
view.builtInEffectManager.dof.setCinematic();
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dof/" />

## See

- [DOF example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dof/)
 - [DOF Auto Focus example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dofAutoFocus/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:90](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L90)

Creates a `DOF` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### aperture

#### Get Signature

> **get** **aperture**(): `number` = `2.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L182)

Gets or sets the aperture F-number ($N$). Lower values (`f/1.4`) produce shallower depth of field and larger bokeh; higher values (`f/8.0`) keep the entire scene sharp. (`0.5 ~ 32.0`, default: `2.0`)

##### Returns

`number`

Aperture F-number

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:186](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### bladeCount

#### Get Signature

> **get** **bladeCount**(): `number` = `6`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:224](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L224)

Gets or sets the aperture blade count (`0 ~ 9`). `0 ~ 2` produces circular bokeh; `3 ~ 9` produces regular polygonal aperture bokeh. (Default: `6`)

##### Returns

`number`

Aperture blade count

#### Set Signature

> **set** **bladeCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:228](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L228)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### bokehBrightness

#### Get Signature

> **get** **bokehBrightness**(): `number` = `1.5`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L245)

Gets or sets the high-luminance HDR highlight bokeh disc boost intensity. (`0.0 ~ 5.0`, default: `1.5`)

##### Returns

`number`

Bokeh highlight boost intensity

#### Set Signature

> **set** **bokehBrightness**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:249](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L249)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### focalLength

#### Get Signature

> **get** **focalLength**(): `number` = `65.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:203](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L203)

Gets or sets the lens focal length $f$ (in `mm`). Longer telephoto focal lengths (`85mm ~ 135mm`) increase background compression and bokeh size. (`12.0 ~ 300.0`, default: `65.0`)

##### Returns

`number`

Lens focal length (`mm`)

#### Set Signature

> **set** **focalLength**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:207](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L207)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number` = `10.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:160](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L160)

Gets or sets the in-focus subject distance $S_1$. (Unit: world meters `m`, valid range: `0.1 ~ 10000`, default: `10.0`)

##### Returns

`number`

Subject focus distance (`m`)

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:164](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useAutoFocus

#### Get Signature

> **get** **useAutoFocus**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:266](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L266)

Gets or sets whether screen-depth-based 9-Point Zone continuous auto-focus (AF-C) is enabled. (Default: `false`)

##### Returns

`boolean`

Whether auto-focus is enabled

#### Set Signature

> **set** **useAutoFocus**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:270](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L270)

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

Defined in: [src/postEffect/builtIn/dof/DOF.ts:140](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L140)

Returns the total video memory usage (in bytes) of all internal sub-passes and persistent focus/CoC history textures.

##### Returns

`number`

Total video memory usage (in bytes)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../../Core/classes/AMultiPassPostEffect.md#videomemorysize)

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:286](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L286)

Clears allocated persistent focus/CoC history textures and bind group caches of all internal sub-passes.

#### Returns

`void`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`clear`](../../Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:297](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L297)

Permanently destroys internal sub-passes and persistent focus/CoC state texture resources.

#### Returns

`void`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`destroy`](../../Core/classes/AMultiPassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/dof/DOF.ts:408](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L408)

Sequentially executes the 3-level CoC mip chain (`Mip 0 ~ Mip 2`), `1/16` tile dilation, foreground/background Dual-Buffer polygonal bokeh gathering, independent foreground/background 9-Tap Tent smoothing, and full-resolution Slight-DoF 8-Tap direct gathering & Recombine.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Input original HDR source texture information |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Final DOF-processed HDR texture information (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:320](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L320)

Applies a fast cinema prime lens Cinematic (`85mm f/1.4`, 8-blade aperture) preset.

#### Returns

`void`

***

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L308)

Applies the standard game camera (`65mm f/2.0`, 6-blade aperture) default preset.

#### Returns

`void`

***

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:344](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L344)

Applies a wide-angle Landscape (`24mm f/8.0`) preset providing deep depth of field.

#### Returns

`void`

***

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:356](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L356)

Applies a close-up Macro (`105mm f/2.0`, circular bokeh) preset that focuses on near subjects and smoothly blurs the background.

#### Returns

`void`

***

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L380)

Applies a Night Mode (`75mm f/1.2`, 6-blade hexagonal bokeh) preset that maximizes nocturnal highlight bokeh discs.

#### Returns

`void`

***

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:332](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L332)

Applies a circular-aperture Portrait (`85mm f/1.4`, circular bokeh) preset.

#### Returns

`void`

***

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:368](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L368)

Applies a telephoto Action/Sports (`135mm f/2.8`) preset.

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

</details>
