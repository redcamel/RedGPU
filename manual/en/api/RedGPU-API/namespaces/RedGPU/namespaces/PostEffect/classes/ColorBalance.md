[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / ColorBalance

# Class: ColorBalance

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L29)


Color Balance post-processing effect.


Adjusts the color balance of shadows, midtones, and highlights for Cyan-Red, Magenta-Green, and Yellow-Blue.


Also supports luminosity preservation option.
* ### Example
```typescript
const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
effect.shadowCyanRed = 50;
effect.midtoneYellowBlue = -30;
effect.preserveLuminosity = true;
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorBalance/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new ColorBalance**(`redGPUContext`): `ColorBalance`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:99](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L99)


Creates a ColorBalance instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`ColorBalance`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Accessors

### highlightCyanRed

#### Get Signature

> **get** **highlightCyanRed**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:220](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L220)


Returns the highlight Cyan-Red value.

##### Returns

`number`

#### Set Signature

> **set** **highlightCyanRed**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:228](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L228)


Sets the highlight Cyan-Red value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### highlightMagentaGreen

#### Get Signature

> **get** **highlightMagentaGreen**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:238](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L238)


Returns the highlight Magenta-Green value.

##### Returns

`number`

#### Set Signature

> **set** **highlightMagentaGreen**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:246](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L246)


Sets the highlight Magenta-Green value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### highlightYellowBlue

#### Get Signature

> **get** **highlightYellowBlue**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:256](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L256)


Returns the highlight Yellow-Blue value.

##### Returns

`number`

#### Set Signature

> **set** **highlightYellowBlue**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:264](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L264)


Sets the highlight Yellow-Blue value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### midtoneCyanRed

#### Get Signature

> **get** **midtoneCyanRed**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:166](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L166)


Returns the midtone Cyan-Red value.

##### Returns

`number`

#### Set Signature

> **set** **midtoneCyanRed**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:174](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L174)


Sets the midtone Cyan-Red value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### midtoneMagentaGreen

#### Get Signature

> **get** **midtoneMagentaGreen**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:184](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L184)


Returns the midtone Magenta-Green value.

##### Returns

`number`

#### Set Signature

> **set** **midtoneMagentaGreen**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:192](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L192)


Sets the midtone Magenta-Green value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### midtoneYellowBlue

#### Get Signature

> **get** **midtoneYellowBlue**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:202](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L202)


Returns the midtone Yellow-Blue value.

##### Returns

`number`

#### Set Signature

> **set** **midtoneYellowBlue**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:210](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L210)


Sets the midtone Yellow-Blue value. (-100 ~ 100)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L203)


Returns the output texture view.

##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### preserveLuminosity

#### Get Signature

> **get** **preserveLuminosity**(): `boolean`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:274](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L274)


Returns whether luminosity is preserved.

##### Returns

`boolean`

#### Set Signature

> **set** **preserveLuminosity**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:282](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L282)


Sets whether luminosity is preserved.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L117)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L133)


Returns shader information. (Depends on MSAA state)

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### shadowCyanRed

#### Get Signature

> **get** **shadowCyanRed**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:112](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L112)


Returns the shadow Cyan-Red value.

##### Returns

`number`

#### Set Signature

> **set** **shadowCyanRed**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:120](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L120)


Sets the shadow Cyan-Red value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### shadowMagentaGreen

#### Get Signature

> **get** **shadowMagentaGreen**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:130](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L130)


Returns the shadow Magenta-Green value.

##### Returns

`number`

#### Set Signature

> **set** **shadowMagentaGreen**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:138](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L138)


Sets the shadow Magenta-Green value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### shadowYellowBlue

#### Get Signature

> **get** **shadowYellowBlue**(): `number`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:148](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L148)


Returns the shadow Yellow-Blue value.

##### Returns

`number`

#### Set Signature

> **set** **shadowYellowBlue**(`value`): `void`

Defined in: [src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts:156](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/effects/adjustments/colorBalance/ColorBalance.ts#L156)


Sets the shadow Yellow-Blue value. (-100 ~ 100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L125)


Returns storage information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L159)


Returns system uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L143)


Returns the uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L151)


Returns uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L101)


Returns whether depth texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L109)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L77)


Returns whether G-Buffer Normal texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L85)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L93)


Returns the video memory usage.

##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L167)


Workgroup Size X

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L171)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L179)


Workgroup Size Y

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L183)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L191)


Workgroup Size Z

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L211)


Clears the effect.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L289)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L236)


Initializes the effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |
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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L322)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L352)


Updates the effect state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Delta time |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`update`](../namespaces/Core/classes/ASinglePassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/postEffect/core/ASinglePassPostEffect.ts#L366)


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
