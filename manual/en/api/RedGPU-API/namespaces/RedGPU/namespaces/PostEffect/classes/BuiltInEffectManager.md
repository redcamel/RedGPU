[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / BuiltInEffectManager

# Class: BuiltInEffectManager

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L38)

Class that manages built-in post-processing effects (`SSAO`, `SSR`, `Fog`, `HeightFog`, `DOF`, `Bloom`, `LensFlare`, `AutoExposure`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`) of a `View3D`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via View3D's builtInEffectManager
const builtInEffectManager = view.builtInEffectManager;
builtInEffectManager.useSSAO = true;
builtInEffectManager.useBloom = true;
builtInEffectManager.bloom.setCinematic();
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new BuiltInEffectManager**(`view`): `BuiltInEffectManager`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:74](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L74)

Creates a `BuiltInEffectManager` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to bind |

#### Returns

`BuiltInEffectManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### autoExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **autoExposure**(): [`AutoExposure`](../namespaces/BuiltIn/classes/AutoExposure.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:111](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L111)

Returns the `AutoExposure` instance.

##### Returns

[`AutoExposure`](../namespaces/BuiltIn/classes/AutoExposure.md)

`AutoExposure` instance

***

***

### bloom

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bloom**(): [`Bloom`](../namespaces/BuiltIn/classes/Bloom.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:341](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L341)

Returns the Bloom effect instance.

##### Returns

[`Bloom`](../namespaces/BuiltIn/classes/Bloom.md)

`Bloom` instance

***

***

### chromaticAberration

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **chromaticAberration**(): [`ChromaticAberration`](../namespaces/BuiltIn/classes/ChromaticAberration.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:411](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L411)

Returns the ChromaticAberration effect instance.

##### Returns

[`ChromaticAberration`](../namespaces/BuiltIn/classes/ChromaticAberration.md)

`ChromaticAberration` instance

***

***

### dof

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dof**(): [`DOF`](../namespaces/BuiltIn/classes/DOF.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:306](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L306)

Returns the DOF effect instance.

##### Returns

[`DOF`](../namespaces/BuiltIn/classes/DOF.md)

`DOF` instance

***

***

### filmGrain

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filmGrain**(): [`FilmGrain`](../namespaces/BuiltIn/classes/FilmGrain.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:516](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L516)

Returns the FilmGrain effect instance.

##### Returns

[`FilmGrain`](../namespaces/BuiltIn/classes/FilmGrain.md)

`FilmGrain` instance

***

***

### fog

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fog**(): [`Fog`](../namespaces/BuiltIn/classes/Fog.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L236)

Returns the Fog effect instance.

##### Returns

[`Fog`](../namespaces/BuiltIn/classes/Fog.md)

`Fog` instance

***

***

### hasAutoExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasAutoExposure**(): `boolean`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:99](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L99)

Returns whether the `AutoExposure` instance has already been initialized.

##### Returns

`boolean`

Whether `AutoExposure` is initialized

***

***

### heightFog

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **heightFog**(): [`HeightFog`](../namespaces/BuiltIn/classes/HeightFog.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:271](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L271)

Returns the HeightFog effect instance.

##### Returns

[`HeightFog`](../namespaces/BuiltIn/classes/HeightFog.md)

`HeightFog` instance

***

***

### lensDistortion

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lensDistortion**(): [`LensDistortion`](../namespaces/BuiltIn/classes/LensDistortion.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:446](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L446)

Returns the LensDistortion effect instance.

##### Returns

[`LensDistortion`](../namespaces/BuiltIn/classes/LensDistortion.md)

`LensDistortion` instance

***

***

### lensFlare

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lensFlare**(): [`LensFlare`](../namespaces/BuiltIn/classes/LensFlare.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:376](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L376)

Returns the LensFlare effect instance.

##### Returns

[`LensFlare`](../namespaces/BuiltIn/classes/LensFlare.md)

`LensFlare` instance

***

***

### ssao

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ssao**(): [`SSAO`](../namespaces/BuiltIn/classes/SSAO.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:166](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L166)

Returns the SSAO effect instance.

##### Returns

[`SSAO`](../namespaces/BuiltIn/classes/SSAO.md)

`SSAO` instance

***

***

### ssr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ssr**(): [`SSR`](../namespaces/BuiltIn/classes/SSR.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:201](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L201)

Returns the SSR effect instance.

##### Returns

[`SSR`](../namespaces/BuiltIn/classes/SSR.md)

`SSR` instance

***

***

### useBloom

#### Get Signature

> **get** **useBloom**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:322](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L322)

Whether Bloom is enabled.

##### Returns

`boolean`

Whether Bloom is enabled

#### Set Signature

> **set** **useBloom**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:326](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useChromaticAberration

#### Get Signature

> **get** **useChromaticAberration**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:392](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L392)

Whether ChromaticAberration is enabled.

##### Returns

`boolean`

Whether ChromaticAberration is enabled

#### Set Signature

> **set** **useChromaticAberration**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:396](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L396)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useDOF

#### Get Signature

> **get** **useDOF**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L287)

Whether DOF (Depth of Field) is enabled.

##### Returns

`boolean`

Whether DOF is enabled

#### Set Signature

> **set** **useDOF**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:291](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L291)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useFilmGrain

#### Get Signature

> **get** **useFilmGrain**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:497](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L497)

Whether FilmGrain is enabled.

##### Returns

`boolean`

Whether FilmGrain is enabled

#### Set Signature

> **set** **useFilmGrain**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:501](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L501)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useFog

#### Get Signature

> **get** **useFog**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:217](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L217)

Whether Fog is enabled.

##### Returns

`boolean`

Whether Fog is enabled

#### Set Signature

> **set** **useFog**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:221](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useHeightFog

#### Get Signature

> **get** **useHeightFog**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:252](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L252)

Whether HeightFog is enabled.

##### Returns

`boolean`

Whether HeightFog is enabled

#### Set Signature

> **set** **useHeightFog**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:256](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L256)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useLensDistortion

#### Get Signature

> **get** **useLensDistortion**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:427](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L427)

Whether LensDistortion is enabled.

##### Returns

`boolean`

Whether LensDistortion is enabled

#### Set Signature

> **set** **useLensDistortion**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:431](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L431)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useLensFlare

#### Get Signature

> **get** **useLensFlare**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:357](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L357)

Whether LensFlare is enabled.

##### Returns

`boolean`

Whether LensFlare is enabled

#### Set Signature

> **set** **useLensFlare**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:361](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L361)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:147](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L147)

Whether SSAO (Screen Space Ambient Occlusion) is enabled.

##### Returns

`boolean`

Whether SSAO is enabled

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:151](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L151)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useSSR

#### Get Signature

> **get** **useSSR**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L182)

Whether SSR (Screen Space Reflection) is enabled.

##### Returns

`boolean`

Whether SSR is enabled

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:186](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useVignetting

#### Get Signature

> **get** **useVignetting**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:462](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L462)

Whether Vignetting is enabled.

##### Returns

`boolean`

Whether Vignetting is enabled

#### Set Signature

> **set** **useVignetting**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:466](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L466)

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

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:531](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L531)

Returns the total video memory usage (in bytes) of all initialized built-in effects.

##### Returns

`number`

Video memory usage (unit: bytes)

***

***

### view

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L87)

Returns the bound `View3D` instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` instance

***

***

### vignetting

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vignetting**(): [`Vignetting`](../namespaces/BuiltIn/classes/Vignetting.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:481](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L481)

Returns the Vignetting effect instance.

##### Returns

[`Vignetting`](../namespaces/BuiltIn/classes/Vignetting.md)

`Vignetting` instance

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:540](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L540)

Clears cached resources of all initialized built-in effects.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:559](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L559)

Destroys all initialized built-in effects and auto-exposure resources.

#### Returns

`void`

***

***

### getPreExposure()

> **getPreExposure**(): `number`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L126)

Calculates and returns the current view's pre-exposure multiplier (`preExposure`) without triggering unnecessary GPU buffer allocation.

#### Returns

`number`

Pre-exposure multiplier

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
