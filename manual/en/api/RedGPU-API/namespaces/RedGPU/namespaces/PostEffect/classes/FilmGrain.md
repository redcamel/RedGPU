[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / FilmGrain

# Class: FilmGrain

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:55](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L55)


Film Grain post-processing effect.


Allows detailed adjustments such as presets, intensity, color, scale, and saturation.
* ### Example
```typescript
const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
effect.filmGrainIntensity = 0.08;
effect.filmGrainScale = 5.0;
effect.coloredGrain = 0.7;
effect.applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE);
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/filmGrain/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new FilmGrain**(`redGPUContext`): `FilmGrain`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:117](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L117)


Creates a FilmGrain instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`FilmGrain`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### HEAVY

> `static` **HEAVY**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:70](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L70)


Heavy grain preset

#### coloredGrain

> **coloredGrain**: `number` = `0.7`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.12`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.6`

#### filmGrainScale

> **filmGrainScale**: `number` = `4.0`

#### grainSaturation

> **grainSaturation**: `number` = `0.8`

***

### MEDIUM

> `static` **MEDIUM**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:65](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L65)


Medium intensity preset

#### coloredGrain

> **coloredGrain**: `number` = `0.5`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.05`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.8`

#### filmGrainScale

> **filmGrainScale**: `number` = `3.0`

#### grainSaturation

> **grainSaturation**: `number` = `0.6`

***

### SUBTLE

> `static` **SUBTLE**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:60](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L60)


Subtle grain preset

#### coloredGrain

> **coloredGrain**: `number` = `0.3`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.02`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.9`

#### filmGrainScale

> **filmGrainScale**: `number` = `2.5`

#### grainSaturation

> **grainSaturation**: `number` = `0.4`

***

### VINTAGE

> `static` **VINTAGE**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:75](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L75)


Vintage preset

#### coloredGrain

> **coloredGrain**: `number` = `0.9`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.08`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.7`

#### filmGrainScale

> **filmGrainScale**: `number` = `5.0`

#### grainSaturation

> **grainSaturation**: `number` = `1.0`

## Accessors

### coloredGrain

#### Get Signature

> **get** **coloredGrain**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:183](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L183)


Returns the colored grain ratio.

##### Returns

`number`

#### Set Signature

> **set** **coloredGrain**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:191](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L191)


Sets the colored grain ratio. (0 ~ 1)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainIntensity

#### Get Signature

> **get** **filmGrainIntensity**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:132](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L132)


Returns the grain intensity.

##### Returns

`number`

#### Set Signature

> **set** **filmGrainIntensity**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:140](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L140)


Sets the grain intensity. (0 ~ 1)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainResponse

#### Get Signature

> **get** **filmGrainResponse**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:149](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L149)


Returns the brightness response.

##### Returns

`number`

#### Set Signature

> **set** **filmGrainResponse**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:157](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L157)


Sets the brightness response. (0 ~ 2)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainScale

#### Get Signature

> **get** **filmGrainScale**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:166](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L166)


Returns the grain scale.

##### Returns

`number`

#### Set Signature

> **set** **filmGrainScale**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:174](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L174)


Sets the grain scale. (0.1 ~ 20)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### grainSaturation

#### Get Signature

> **get** **grainSaturation**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:200](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L200)


Returns the grain saturation.

##### Returns

`number`

#### Set Signature

> **set** **grainSaturation**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:208](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L208)


Sets the grain saturation. (0 ~ 2)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L203)


Returns the output texture view.

##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L117)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L133)


Returns shader information. (Depends on MSAA state)

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L125)


Returns storage information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L159)


Returns system uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L143)


Returns the uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L151)


Returns uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L101)


Returns whether depth texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L109)


Sets whether depth texture is used.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`useDepthTexture`](../namespaces/Core/classes/ASinglePassPostEffect.md#usedepthtexture)

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L77)


Returns whether G-Buffer Normal texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L85)


Sets whether G-Buffer Normal texture is used.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`useGBufferNormalTexture`](../namespaces/Core/classes/ASinglePassPostEffect.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L93)


Returns the video memory usage.

##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L167)


Workgroup Size X

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L179)


Workgroup Size Y

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L191)


Workgroup Size Z

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### applyPreset()

> **applyPreset**(`preset`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:221](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L221)


Applies a preset.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `preset` | \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} | Preset object to apply |

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L211)


Clears the effect.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L289)


Executes the effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `gpuDevice` | `GPUDevice` | GPU Device |
| `width` | `number` | Width |
| `height` | `number` | Height |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`execute`](../namespaces/Core/classes/ASinglePassPostEffect.md#execute)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L236)


Initializes the effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU Context |
| `name` | `string` | Effect name |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | Compute shader codes for MSAA and Non-MSAA |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa?` | `string` | - |
| `bindGroupLayout?` | `GPUBindGroupLayout` | Bind group layout (optional) |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L322)


Renders the effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| ...`sourceTextureInfo` | `ASinglePassPostEffectResult`[] | Source texture info list |

#### Returns

`ASinglePassPostEffectResult`


Rendering result (texture and view)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:238](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/effects/filmGrain/FilmGrain.ts#L238)


Updates the time. (For animation)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Delta time |

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`update`](../namespaces/Core/classes/ASinglePassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L366)


Updates a uniform value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform key |
| `value` | `number` \| `boolean` \| `number`[] | Uniform value |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)
