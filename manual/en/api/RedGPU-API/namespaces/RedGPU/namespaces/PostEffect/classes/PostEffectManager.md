[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:37](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L37)

Class for managing post-processing effects.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
view.postEffectManager.addEffect(effect);
```

## Constructors

### Constructor

> **new PostEffectManager**(`view`): `PostEffectManager`

Defined in: [src/postEffect/PostEffectManager.ts:100](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L100)

Creates a PostEffectManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |

#### Returns

`PostEffectManager`

## Accessors

### autoExposure

#### Get Signature

> **get** **autoExposure**(): [`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)

Defined in: [src/postEffect/PostEffectManager.ts:151](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L151)

Returns the Auto Exposure instance.

##### Returns

[`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)

Auto Exposure instance

***

### effectList

#### Get Signature

> **get** **effectList**(): ([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:270](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L270)

Returns the list of registered effects.

##### Returns

([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Array of post-processing effects

***

### gbufferBindGroup

#### Get Signature

> **get** **gbufferBindGroup**(): `GPUBindGroup`

Defined in: [src/postEffect/PostEffectManager.ts:127](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L127)

Returns the shared G-Buffer bind group for the current swap index.

##### Returns

`GPUBindGroup`

Shared G-Buffer bind group

***

### gbufferBindGroupLayout

#### Get Signature

> **get** **gbufferBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/postEffect/PostEffectManager.ts:115](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L115)

Returns the standard G-Buffer bind group layout for the current MSAA state.

##### Returns

`GPUBindGroupLayout`

G-Buffer bind group layout

***

### postEffectSystemUniformBuffer

#### Get Signature

> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:246](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L246)

Returns the system globalStruct buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

UniformBuffer instance

***

### ssao

#### Get Signature

> **get** **ssao**(): `SSAO`

Defined in: [src/postEffect/PostEffectManager.ts:191](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L191)

Returns the SSAO effect instance.

##### Returns

`SSAO`

SSAO instance

***

### ssr

#### Get Signature

> **get** **ssr**(): `SSR`

Defined in: [src/postEffect/PostEffectManager.ts:231](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L231)

Returns the SSR effect instance.

##### Returns

`SSR`

SSR instance

***

### texturePool

#### Get Signature

> **get** **texturePool**(): [`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Defined in: [src/postEffect/PostEffectManager.ts:139](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L139)

Returns the texture pool instance.

##### Returns

[`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Post-effect texture pool instance

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:166](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L166)

Returns whether SSAO is used.

##### Returns

`boolean`

Whether SSAO is used

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:178](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L178)

Sets whether SSAO is used.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether SSAO is used |

##### Returns

`void`

***

### useSSR

#### Get Signature

> **get** **useSSR**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:206](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L206)

Returns whether SSR is used.

##### Returns

`boolean`

Whether SSR is used

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:218](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L218)

Sets whether SSR is used.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether SSR is used |

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/PostEffectManager.ts:282](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L282)

Returns video memory usage.

##### Returns

`number`

Video memory usage (bytes)

***

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:258](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L258)

Returns the connected View3D instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

View3D instance

## Methods

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:338](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L338)

Adds an effect.

* ### Example
```typescript
view.postEffectManager.addEffect(new RedGPU.PostEffect.Bloom(redGPUContext));
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | Effect to add |

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:547](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L547)

Clears all effect resources.

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:287](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L287)

#### Returns

`void`

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:353](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L353)

Returns the effect at a specific index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index |

#### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Effect at the given index

***

### removeAllEffect()

> **removeAllEffect**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:392](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L392)

Removes all effects.

#### Returns

`void`

***

### removeEffect()

> **removeEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:365](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L365)

Removes a specific effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | Effect to remove |

#### Returns

`void`

***

### removeEffectAt()

> **removeEffectAt**(`index`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:381](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L381)

Removes the effect at a specific index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index |

#### Returns

`void`

***

### render()

> **render**(): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/PostEffectManager.ts:407](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/postEffect/PostEffectManager.ts#L407)

Renders the post-processing pipeline.

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result texture information
