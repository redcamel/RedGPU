[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:34](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L34)


Class for managing post-processing effects.

::: warning

This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/postEffect/PostEffectManager.ts:132](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L132)


Creates a PostEffectManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |

#### Returns

`PostEffectManager`

## Accessors

### effectList

#### Get Signature

> **get** **effectList**(): ([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:249](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L249)


Returns the list of registered effects.

##### Returns

([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]


Array of post-processing effects

***

### postEffectSystemUniformBuffer

#### Get Signature

> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:225](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L225)


Returns the system uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)


UniformBuffer instance

***

### ssao

#### Get Signature

> **get** **ssao**(): `SSAO`

Defined in: [src/postEffect/PostEffectManager.ts:170](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L170)


Returns the SSAO effect instance.

##### Returns

`SSAO`


SSAO instance

***

### ssr

#### Get Signature

> **get** **ssr**(): `SSR`

Defined in: [src/postEffect/PostEffectManager.ts:210](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L210)


Returns the SSR effect instance.

##### Returns

`SSR`


SSR instance

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:145](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L145)


Returns whether SSAO is used.

##### Returns

`boolean`


Whether SSAO is used

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:157](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L157)


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

Defined in: [src/postEffect/PostEffectManager.ts:185](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L185)


Returns whether SSR is used.

##### Returns

`boolean`


Whether SSR is used

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:197](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L197)


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

Defined in: [src/postEffect/PostEffectManager.ts:261](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L261)


Returns video memory usage.

##### Returns

`number`


Video memory usage (bytes)

***

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:237](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L237)


Returns the connected View3D instance.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


View3D instance

## Methods

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:279](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L279)


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

Defined in: [src/postEffect/PostEffectManager.ts:420](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L420)


Clears all effect resources.

#### Returns

`void`

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:298](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L298)


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

Defined in: [src/postEffect/PostEffectManager.ts:314](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L314)


Removes all effects.

#### Returns

`void`

***

### render()

> **render**(): `object`

Defined in: [src/postEffect/PostEffectManager.ts:330](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L330)


Renders the post-processing pipeline.

#### Returns

`object`


Rendering result texture information

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | [src/postEffect/PostEffectManager.ts:342](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L342) |
| `textureView` | `GPUTextureView` | [src/postEffect/PostEffectManager.ts:343](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/PostEffectManager.ts#L343) |
