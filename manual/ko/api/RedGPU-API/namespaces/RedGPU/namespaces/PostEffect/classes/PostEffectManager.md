[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:37](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L37)

후처리 이펙트(PostEffect) 관리 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

Defined in: [src/postEffect/PostEffectManager.ts:99](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L99)

PostEffectManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

`PostEffectManager`

## Accessors

### autoExposure

#### Get Signature

> **get** **autoExposure**(): [`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)

Defined in: [src/postEffect/PostEffectManager.ts:150](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L150)

자동 노출(Auto Exposure) 인스턴스를 반환합니다.

##### Returns

[`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)

자동 노출 인스턴스

***

### effectList

#### Get Signature

> **get** **effectList**(): ([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:269](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L269)

등록된 이펙트 리스트를 반환합니다.

##### Returns

([`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

후처리 이펙트 배열

***

### gbufferBindGroup

#### Get Signature

> **get** **gbufferBindGroup**(): `GPUBindGroup`

Defined in: [src/postEffect/PostEffectManager.ts:126](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L126)

현재 스왑 인덱스에 맞는 공유 G-Buffer 바인드 그룹을 반환합니다.

##### Returns

`GPUBindGroup`

공유 G-Buffer 바인드 그룹

***

### gbufferBindGroupLayout

#### Get Signature

> **get** **gbufferBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/postEffect/PostEffectManager.ts:114](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L114)

현재 MSAA 상태에 맞는 표준 G-Buffer 바인드 그룹 레이아웃을 반환합니다.

##### Returns

`GPUBindGroupLayout`

G-Buffer 바인드 그룹 레이아웃

***

### postEffectSystemUniformBuffer

#### Get Signature

> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:245](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L245)

시스템 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

UniformBuffer 인스턴스

***

### ssao

#### Get Signature

> **get** **ssao**(): `SSAO`

Defined in: [src/postEffect/PostEffectManager.ts:190](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L190)

SSAO 이펙트 인스턴스를 반환합니다.

##### Returns

`SSAO`

SSAO 인스턴스

***

### ssr

#### Get Signature

> **get** **ssr**(): `SSR`

Defined in: [src/postEffect/PostEffectManager.ts:230](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L230)

SSR 이펙트 인스턴스를 반환합니다.

##### Returns

`SSR`

SSR 인스턴스

***

### texturePool

#### Get Signature

> **get** **texturePool**(): [`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Defined in: [src/postEffect/PostEffectManager.ts:138](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L138)

텍스처 풀 인스턴스를 반환합니다.

##### Returns

[`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

포스트 이펙트 텍스처 풀 인스턴스

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean`

Defined in: [src/postEffect/PostEffectManager.ts:165](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L165)

SSAO 사용 여부를 반환합니다.

##### Returns

`boolean`

SSAO 사용 여부

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:177](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L177)

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

Defined in: [src/postEffect/PostEffectManager.ts:205](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L205)

SSR 사용 여부를 반환합니다.

##### Returns

`boolean`

SSR 사용 여부

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:217](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L217)

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

Defined in: [src/postEffect/PostEffectManager.ts:281](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L281)

비디오 메모리 사용량을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (bytes)

***

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:257](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L257)

연결된 View3D 인스턴스를 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

View3D 인스턴스

## Methods

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:299](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L299)

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

Defined in: [src/postEffect/PostEffectManager.ts:508](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L508)

모든 이펙트 리소스를 정리합니다.

#### Returns

`void`

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:314](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L314)

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

Defined in: [src/postEffect/PostEffectManager.ts:353](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L353)

모든 이펙트를 제거합니다.

#### Returns

`void`

***

### removeEffect()

> **removeEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:326](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L326)

특정 이펙트를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | 제거할 이펙트

#### Returns

`void`

***

### removeEffectAt()

> **removeEffectAt**(`index`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:342](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L342)

특정 인덱스의 이펙트를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 인덱스

#### Returns

`void`

***

### render()

> **render**(): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/PostEffectManager.ts:368](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/postEffect/PostEffectManager.ts#L368)

후처리 파이프라인을 렌더링합니다.

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

렌더링 결과 텍스처 정보
