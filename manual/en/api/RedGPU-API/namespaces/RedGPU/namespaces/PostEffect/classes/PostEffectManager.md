[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:37](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L37)

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

Defined in: [src/postEffect/PostEffectManager.ts:99](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L99)

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

Defined in: [src/postEffect/PostEffectManager.ts:150](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L150)

Returns the Auto Exposure instance.

##### Returns

[`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)

Auto Exposure instance

***

### effectList

#### Get Signature

> **get** **effectList**(): ([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:269](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L269)

Returns the list of registered effects.

##### Returns

([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Array of post-processing effects

***

### gbufferBindGroup

#### Get Signature

> **get** **gbufferBindGroup**(): `GPUBindGroup`

Defined in: [src/postEffect/PostEffectManager.ts:126](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L126)

Returns the shared G-Buffer bind group for the current swap index.

##### Returns

`GPUBindGroup`

Shared G-Buffer bind group

***

### gbufferBindGroupLayout

#### Get Signature

> **get** **gbufferBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/postEffect/PostEffectManager.ts:114](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L114)

Returns the standard G-Buffer bind group layout for the current MSAA state.

##### Returns

`GPUBindGroupLayout`

G-Buffer bind group layout

***

### postEffectSystemUniformBuffer

#### Get Signature

> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:245](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L245)

Returns the system uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

UniformBuffer instance

***

### ssao

#### Get Signature

> **get** **ssao**(): `SSAO`

Defined in: [src/postEffect/PostEffectManager.ts:190](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L190)

Returns the SSAO effect instance.

##### Returns

`SSAO`

SSAO instance

***

### ssr

#### Get Signature

> **get** **ssr**(): `SSR`

Defined in: [src/postEffect/PostEffectManager.ts:230](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L230)

Returns the SSR effect instance.

##### Returns

`SSR`

SSR instance

***

### texturePool

#### Get Signature

> **get** **texturePool**(): [`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Defined in: [src/postEffect/PostEffectManager.ts:138](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L138)

Returns the texture pool instance.

##### Returns

[`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Post-effect texture pool instance

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:165](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L165)

Returns whether SSAO is used.

##### Returns

`boolean`

Whether SSAO is used

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:177](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L177)

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

Defined in: [src/postEffect/PostEffectManager.ts:205](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L205)

Returns whether SSR is used.

##### Returns

`boolean`

Whether SSR is used

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:217](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L217)

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

Defined in: [src/postEffect/PostEffectManager.ts:281](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L281)

Returns video memory usage.

##### Returns

`number`

Video memory usage (bytes)

***

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:257](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L257)

Returns the connected View3D instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

View3D instance

## Methods

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:299](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L299)

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

Defined in: [src/postEffect/PostEffectManager.ts:508](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L508)

Clears all effect resources.

#### Returns

`void`

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:314](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L314)

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

Defined in: [src/postEffect/PostEffectManager.ts:353](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L353)

Removes all effects.

#### Returns

`void`

***

### removeEffect()

> **removeEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:326](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L326)

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

Defined in: [src/postEffect/PostEffectManager.ts:342](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L342)

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

Defined in: [src/postEffect/PostEffectManager.ts:368](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/postEffect/PostEffectManager.ts#L368)

Renders the post-processing pipeline.

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result texture information
