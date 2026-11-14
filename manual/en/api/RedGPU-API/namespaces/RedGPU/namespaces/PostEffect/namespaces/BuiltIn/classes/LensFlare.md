[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / LensFlare

# Class: LensFlare

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L33)

Next-generation hybrid Lens Flare post-processing effect combining screen-space HDR highlights (multi-coated ghosts, Fresnel halo, radial chromatic aberration) with 9-Tap depth-occluded analytic sun optics (hollow caustic polygonal aperture bokeh, Fraunhofer diffraction starburst, anamorphic streak, and lens dirt scattering).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
view.builtInEffectManager.useLensFlare = true;
const lensFlare = view.builtInEffectManager.lensFlare;
lensFlare.setCinematic();
lensFlare.intensity = 1.2;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/" />

## See

- [LensFlare (SkyAtmosphere) example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
 - [LensFlare (SkyBox) example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyBox/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new LensFlare**(`redGPUContext`): `LensFlare`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:46](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L46)

Creates a `LensFlare` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`LensFlare`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### anamorphicIntensity

#### Get Signature

> **get** **anamorphicIntensity**(): `number` = `0.0`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:270](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L270)

Returns or sets the cinematic horizontal anamorphic streak intensity (0.0 ~ 5.0).

##### Returns

`number`

Anamorphic streak intensity

#### Set Signature

> **set** **anamorphicIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:274](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L274)

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

> **get** **bladeCount**(): `number` = `8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L236)

Returns or sets the aperture blade count (4 ~ 12). (`6`=hexagonal, `8`=octagonal)

##### Returns

`number`

Aperture blade count

#### Set Signature

> **set** **bladeCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:240](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L240)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### blurSize

#### Get Signature

> **get** **blurSize**(): `number` = `14`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:304](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L304)

Returns or sets the screen-space flare softening Gaussian blur radius (1 ~ 64).

##### Returns

`number`

Blur radius

#### Set Signature

> **set** **blurSize**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L308)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### chromaticAberration

#### Get Signature

> **get** **chromaticAberration**(): `number` = `0.015`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:218](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L218)

Returns or sets the radial chromatic aberration dispersion strength (0.0 ~ 0.1) at ghost and halo edges.

##### Returns

`number`

Chromatic aberration strength

#### Set Signature

> **set** **chromaticAberration**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:222](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L222)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostCount

#### Get Signature

> **get** **ghostCount**(): `number` = `8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:110](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L110)

Returns or sets the number of ghosts (0 ~ 12) generated by internal lens barrel multi-reflections.

##### Returns

`number`

Ghost count

#### Set Signature

> **set** **ghostCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:114](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L114)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostIntensity

#### Get Signature

> **get** **ghostIntensity**(): `number` = `1.15`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:147](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L147)

Returns or sets the brightness intensity (0.0 ~ 5.0) of multi-reflection ghosts.

##### Returns

`number`

Ghost brightness intensity

#### Set Signature

> **set** **ghostIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:151](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L151)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostSpacing

#### Get Signature

> **get** **ghostSpacing**(): `number` = `0.34`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:129](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L129)

Returns or sets the ghost spacing multiplier (0.05 ~ 1.0) along the screen-center optical axis.

##### Returns

`number`

Ghost spacing multiplier

#### Set Signature

> **set** **ghostSpacing**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:133](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloIntensity

#### Get Signature

> **get** **haloIntensity**(): `number` = `0.65`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:200](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L200)

Returns or sets the brightness intensity (0.0 ~ 5.0) of the Fresnel halo ring.

##### Returns

`number`

Halo ring brightness intensity

#### Set Signature

> **set** **haloIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:204](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloRadius

#### Get Signature

> **get** **haloRadius**(): `number` = `0.46`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:165](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L165)

Returns or sets the radius (0.1 ~ 0.9) of the Fresnel halo ring.

##### Returns

`number`

Halo ring radius

#### Set Signature

> **set** **haloRadius**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:169](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloThickness

#### Get Signature

> **get** **haloThickness**(): `number` = `0.16`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:183](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L183)

Returns or sets the thickness (0.02 ~ 0.5) of the Fresnel halo ring.

##### Returns

`number`

Halo ring thickness

#### Set Signature

> **set** **haloThickness**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:187](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L187)

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

> **get** **intensity**(): `number` = `1.1`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:76](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L76)

Returns or sets the overall lens flare final composition intensity (0.0 ~ 10.0).

##### Returns

`number`

Lens flare composition intensity

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L80)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lensDirtIntensity

#### Get Signature

> **get** **lensDirtIntensity**(): `number` = `0.25`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L287)

Returns or sets the camera lens surface micro-dust scattering mask intensity (0.0 ~ 2.0).

##### Returns

`number`

Lens dirt scattering intensity

#### Set Signature

> **set** **lensDirtIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:291](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L291)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### starburstIntensity

#### Get Signature

> **get** **starburstIntensity**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:253](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L253)

Returns or sets the aperture diffraction starburst intensity (0.0 ~ 5.0) of the sun/primary light.

##### Returns

`number`

Starburst intensity

#### Set Signature

> **set** **starburstIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:257](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L257)

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

> **get** **threshold**(): `number` = `1.8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L93)

Returns or sets the linear luminance threshold (0.1 ~ 20.0) where screen-space HDR highlight extraction begins.

##### Returns

`number`

Linear HDR luminance threshold

#### Set Signature

> **set** **threshold**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:97](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L97)

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

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:438](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L438)

Sequentially executes `1/2` resolution screen-space flare generation, HDR Gaussian blur softening, and full-resolution optical flare & lens dirt composition.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Input original HDR source texture information |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Final HDR texture information with lens flare composited (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

***

### setAnamorphic()

> **setAnamorphic**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:359](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L359)

Applies a sci-fi and action movie style cinematic horizontal anamorphic streak preset.

#### Returns

`void`

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:338](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L338)

Applies a cinematic preset providing rich polygonal bokeh ghosts and halos based on an 8-blade fast cinema prime lens.

#### Returns

`void`

***

***

### setNatural()

> **setNatural**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:317](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L317)

Applies the default 8-element physical lens flare preset.

#### Returns

`void`

***

***

### setSolarMax()

> **setSolarMax**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L380)

Applies a high-intensity starburst and multi-spectrum ghost preset for intense solar backlight and desert/space scenes.

#### Returns

`void`

***

***

### setSubtle()

> **setSubtle**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:401](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L401)

Applies a subtle, non-intrusive glare and halo preset for architectural visualization and product showcases.

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
