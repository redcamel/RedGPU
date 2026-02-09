[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / Grayscale

# Class: Grayscale

Defined in: [src/postEffect/effects/adjustments/grayscale/Grayscale.ts:21](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/adjustments/grayscale/Grayscale.ts#L21)


Grayscale post-processing effect.


Converts the screen to black and white.
* ### Example
```typescript
const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/grayscale/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new Grayscale**(`redGPUContext`): `Grayscale`

Defined in: [src/postEffect/effects/adjustments/grayscale/Grayscale.ts:30](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/adjustments/grayscale/Grayscale.ts#L30)


Creates a Grayscale instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`Grayscale`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Accessors

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L203)


Returns the output texture view.

##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L117)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L133)


Returns shader information. (Depends on MSAA state)

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L125)


Returns storage information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L159)


Returns system uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L143)


Returns the uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L151)


Returns uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L101)


Returns whether depth texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L109)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L77)


Returns whether G-Buffer Normal texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L85)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L93)


Returns the video memory usage.

##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L167)


Workgroup Size X

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L171)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L179)


Workgroup Size Y

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L183)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L191)


Workgroup Size Z

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L195)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L211)


Clears the effect.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L289)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L236)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L322)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L352)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L366)


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
