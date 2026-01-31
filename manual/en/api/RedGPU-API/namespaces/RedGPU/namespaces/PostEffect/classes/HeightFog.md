[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / HeightFog

# Class: HeightFog

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:31](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L31)


Height Fog post-processing effect.


Supports various parameters such as fog type, density, base height, thickness, falloff, and color.
* ### Example
```typescript
const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
effect.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
effect.density = 0.5;
effect.baseHeight = 10.0;
effect.thickness = 80.0;
effect.falloff = 0.2;
effect.fogColor.setRGB(180, 200, 255);
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/fog/heightFog/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new HeightFog**(`redGPUContext`): `HeightFog`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:86](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L86)


Creates a HeightFog instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`HeightFog`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### EXPONENTIAL

> `static` **EXPONENTIAL**: `number` = `0`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:36](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L36)


Exponential fog type

***

### EXPONENTIAL\_SQUARED

> `static` **EXPONENTIAL\_SQUARED**: `number` = `1`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:41](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L41)


Exponential Squared fog type

## Accessors

### baseHeight

#### Get Signature

> **get** **baseHeight**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:153](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L153)


Returns the fog base height.

##### Returns

`number`

#### Set Signature

> **set** **baseHeight**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:161](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L161)


Sets the fog base height.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### density

#### Get Signature

> **get** **density**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:127](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L127)


Returns the fog density.

##### Returns

`number`

#### Set Signature

> **set** **density**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:135](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L135)


Sets the fog density. (0 ~ 5)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### falloff

#### Get Signature

> **get** **falloff**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:200](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L200)


Returns the height falloff.

##### Returns

`number`

#### Set Signature

> **set** **falloff**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:208](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L208)


Sets the height falloff. (0.001 ~ 2)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### fogColor

#### Get Signature

> **get** **fogColor**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:145](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L145)


Returns the fog color.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

***

### fogType

#### Get Signature

> **get** **fogType**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:109](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L109)


Returns the fog type.

##### Returns

`number`

#### Set Signature

> **set** **fogType**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:117](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L117)


Sets the fog type. (0 or 1)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxHeight

#### Get Signature

> **get** **maxHeight**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:173](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L173)


Returns the fog max height. (baseHeight + thickness)

##### Returns

`number`

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L203)


Returns the output texture view.

##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L117)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L133)


Returns shader information. (Depends on MSAA state)

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L125)


Returns storage information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L159)


Returns system uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### thickness

#### Get Signature

> **get** **thickness**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:181](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L181)


Returns the fog layer thickness.

##### Returns

`number`

#### Set Signature

> **set** **thickness**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:189](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L189)


Sets the fog layer thickness. (Minimum 0.1)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L143)


Returns the uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L151)


Returns uniform information.

##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L101)


Returns whether depth texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L109)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L77)


Returns whether G-Buffer Normal texture is used.

##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L85)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L93)


Returns the video memory usage.

##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L167)


Workgroup Size X

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L171)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L179)


Workgroup Size Y

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L183)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L191)


Workgroup Size Z

##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L195)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L211)


Clears the effect.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L289)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L236)


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

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:234](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/effects/fog/heightFog/HeightFog.ts#L234)


Renders the fog effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | Source texture info |

#### Returns

`ASinglePassPostEffectResult`


Rendering result

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L352)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/postEffect/core/ASinglePassPostEffect.ts#L366)


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
