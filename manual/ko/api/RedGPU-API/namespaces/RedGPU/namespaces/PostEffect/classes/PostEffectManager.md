[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:34](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L34)

후처리 이펙트(PostEffect) 관리 클래스입니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

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

Defined in: [src/postEffect/PostEffectManager.ts:132](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L132)

PostEffectManager 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

`PostEffectManager`

## Accessors

### effectList

#### Get Signature

> **get** **effectList**(): ([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:249](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L249)

등록된 이펙트 리스트를 반환합니다.


##### Returns

([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

후처리 이펙트 배열


***

### postEffectSystemUniformBuffer

#### Get Signature

> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:225](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L225)

시스템 유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

UniformBuffer 인스턴스


***

### ssao

#### Get Signature

> **get** **ssao**(): `SSAO`

Defined in: [src/postEffect/PostEffectManager.ts:170](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L170)

SSAO 이펙트 인스턴스를 반환합니다.


##### Returns

`SSAO`

SSAO 인스턴스


***

### ssr

#### Get Signature

> **get** **ssr**(): `SSR`

Defined in: [src/postEffect/PostEffectManager.ts:210](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L210)

SSR 이펙트 인스턴스를 반환합니다.


##### Returns

`SSR`

SSR 인스턴스


***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:145](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L145)

SSAO 사용 여부를 반환합니다.


##### Returns

`boolean`

SSAO 사용 여부


#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:157](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L157)

SSAO 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | SSAO 사용 여부

##### Returns

`void`

***

### useSSR

#### Get Signature

> **get** **useSSR**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:185](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L185)

SSR 사용 여부를 반환합니다.


##### Returns

`boolean`

SSR 사용 여부


#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:197](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L197)

SSR 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | SSR 사용 여부

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/PostEffectManager.ts:261](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L261)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

비디오 메모리 사용량 (bytes)


***

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:237](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L237)

연결된 View3D 인스턴스를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

View3D 인스턴스


## Methods

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:279](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L279)

이펙트를 추가합니다.


* ### Example
```typescript
view.postEffectManager.addEffect(new RedGPU.PostEffect.Bloom(redGPUContext));
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | 추가할 이펙트

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:420](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L420)

모든 이펙트 리소스를 정리합니다.


#### Returns

`void`

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:298](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L298)

특정 인덱스의 이펙트를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 인덱스

#### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

해당 인덱스의 이펙트


***

### removeAllEffect()

> **removeAllEffect**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:314](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L314)

모든 이펙트를 제거합니다.


#### Returns

`void`

***

### render()

> **render**(): `object`

Defined in: [src/postEffect/PostEffectManager.ts:330](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L330)

후처리 파이프라인을 렌더링합니다.


#### Returns

`object`

렌더링 결과 텍스처 정보


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | [src/postEffect/PostEffectManager.ts:342](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L342) |
| `textureView` | `GPUTextureView` | [src/postEffect/PostEffectManager.ts:343](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/postEffect/PostEffectManager.ts#L343) |
