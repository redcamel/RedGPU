[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:30](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L30)


Depth of Field (DOF) post-processing effect.


Provides realistic depth effects by combining CoC (Circle of Confusion) calculation and blur.


Supports various photo/video style preset methods.
* ### Example
```typescript
const effect = new RedGPU.PostEffect.DOF(redGPUContext);
effect.focusDistance = 10;
effect.aperture = 2.0;
effect.maxCoC = 30;
effect.setCinematic(); // 시네마틱 프리셋 적용
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/lens/dof/"></iframe>

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:106](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L106)


Creates a DOF instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:151](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L151)


Returns the aperture value.

##### Returns

`number`

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:159](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L159)


Sets the aperture value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farBlurSize

#### Get Signature

> **get** **farBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:237](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L237)


Returns the far blur size.

##### Returns

`number`

#### Set Signature

> **set** **farBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:245](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L245)


Sets the far blur size.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farPlane

#### Get Signature

> **get** **farPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:202](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L202)


Returns the far plane value.

##### Returns

`number`

#### Set Signature

> **set** **farPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:210](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L210)


Sets the far plane value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farStrength

#### Get Signature

> **get** **farStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:271](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L271)


Returns the far blur strength.

##### Returns

`number`

#### Set Signature

> **set** **farStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:279](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L279)


Sets the far blur strength.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:134](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L134)


Returns the focus distance.

##### Returns

`number`

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:142](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L142)


Sets the focus distance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxCoC

#### Get Signature

> **get** **maxCoC**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:168](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L168)


Returns the max CoC value.

##### Returns

`number`

#### Set Signature

> **set** **maxCoC**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:176](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L176)


Sets the max CoC value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearBlurSize

#### Get Signature

> **get** **nearBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:220](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L220)


Returns the near blur size.

##### Returns

`number`

#### Set Signature

> **set** **nearBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:228](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L228)


Sets the near blur size.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearPlane

#### Get Signature

> **get** **nearPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:185](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L185)


Returns the near plane value.

##### Returns

`number`

#### Set Signature

> **set** **nearPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:193](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L193)


Sets the near plane value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearStrength

#### Get Signature

> **get** **nearStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:254](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L254)


Returns the near blur strength.

##### Returns

`number`

#### Set Signature

> **set** **nearStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:262](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L262)


Sets the near blur strength.

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L203)


Returns the output texture view.

##### Returns

`GPUTextureView`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/AMultiPassPostEffect.md#outputtextureview)

***

### passList

#### Get Signature

> **get** **passList**(): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:57](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/AMultiPassPostEffect.ts#L57)


Returns the internal pass list.

##### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L117)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L133)


Returns shader information. (Depends on MSAA state)

##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L125)


Returns storage information.

##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L159)


Returns system uniform information.

##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L143)


Returns the uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L151)


Returns uniform information.

##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L101)


Returns whether depth texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L109)


Sets whether depth texture is used.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useDepthTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usedepthtexture)

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L77)


Returns whether G-Buffer Normal texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L85)


Sets whether G-Buffer Normal texture is used.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useGBufferNormalTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:48](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/AMultiPassPostEffect.ts#L48)


Returns the video memory usage.

##### Returns

`number`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L167)


Workgroup Size X

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L179)


Workgroup Size Y

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L191)


Workgroup Size Z

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:65](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/AMultiPassPostEffect.ts#L65)


Clears all passes.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L289)


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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`execute`](../namespaces/Core/classes/AMultiPassPostEffect.md#execute)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L236)


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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`init`](../namespaces/Core/classes/AMultiPassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:402](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L402)


Renders the DOF effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | Source texture info |

#### Returns

`ASinglePassPostEffectResult`


Final DOF result

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:302](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L302)


Applies the Cinematic preset. (Strong DOF, cinematic feel)

#### Returns

`void`

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:288](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L288)


Applies the Game Default preset. (Balanced quality/performance)

#### Returns

`void`

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:330](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L330)


Applies the Landscape preset. (Generally sharp, slight far blur)

#### Returns

`void`

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:344](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L344)


Applies the Macro preset. (Extremely shallow depth of field)

#### Returns

`void`

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:372](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L372)


Applies the Night Mode preset. (Low light environment)

#### Returns

`void`

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:316](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L316)


Applies the Portrait preset. (Blurred background, focused subject)

#### Returns

`void`

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:358](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/effects/lens/dof/DOF.ts#L358)


Applies the Action/Sports preset. (Suitable for fast motion)

#### Returns

`void`

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L352)


Updates the effect state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Delta time |

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`update`](../namespaces/Core/classes/AMultiPassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/postEffect/core/ASinglePassPostEffect.ts#L366)


Updates a uniform value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform key |
| `value` | `number` \| `boolean` \| `number`[] | Uniform value |

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/AMultiPassPostEffect.md#updateuniform)
