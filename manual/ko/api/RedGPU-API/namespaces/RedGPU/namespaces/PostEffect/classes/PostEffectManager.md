[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / PostEffectManager

# Class: PostEffectManager

Defined in: [src/postEffect/PostEffectManager.ts:35](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L35)

`View3D`의 후처리 파이프라인과 사용자 후처리 이펙트 리스트를 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 postEffectManager를 통해 접근
const postEffectManager = view.postEffectManager;
postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PostEffectManager**(`view`): `PostEffectManager`

Defined in: [src/postEffect/PostEffectManager.ts:85](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L85)

PostEffectManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 연결할 `View3D` 인스턴스 |

#### Returns

`PostEffectManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### effectList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **effectList**(): ([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/PostEffectManager.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L161)

등록된 사용자 후처리 이펙트 배열을 반환합니다.

##### Returns

([`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md))[]

후처리 이펙트 배열 (`Array<ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect>`)

***

***

### gbufferBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gbufferBindGroup**(): `GPUBindGroup`

Defined in: [src/postEffect/PostEffectManager.ts:113](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L113)

현재 스왑 버퍼 인덱스에 맞는 공유 G-Buffer 바인드 그룹을 반환합니다.

##### Returns

`GPUBindGroup`

공유 G-Buffer `GPUBindGroup`

***

***

### gbufferBindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gbufferBindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/postEffect/PostEffectManager.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L101)

공유 G-Buffer 바인드 그룹 레이아웃을 반환합니다.

##### Returns

`GPUBindGroupLayout`

G-Buffer `GPUBindGroupLayout`

***

***

### postEffectSystemUniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **postEffectSystemUniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/PostEffectManager.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L137)

후처리 시스템 공용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

시스템 `UniformBuffer` 인스턴스

***

***

### texturePool

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **texturePool**(): [`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

Defined in: [src/postEffect/PostEffectManager.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L125)

후처리 텍스처 풀 인스턴스를 반환합니다.

##### Returns

[`PostEffectTexturePool`](../namespaces/Core/classes/PostEffectTexturePool.md)

`PostEffectTexturePool` 인스턴스

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/PostEffectManager.ts:173](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L173)

텍스처 풀과 등록된 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

***

***

### view

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/PostEffectManager.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L149)

연결된 `View3D` 인스턴스를 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` 인스턴스

## Methods



***

### addEffect()

> **addEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:214](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L214)

후처리 파이프라인에 이펙트를 추가합니다.

#### Example
```typescript
view.postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | 추가할 후처리 이펙트 인스턴스 |

#### Returns

`void`

***

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:385](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L385)

등록된 모든 이펙트와 텍스처 풀의 캐시된 리소스를 비웁니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L182)

등록된 모든 후처리 이펙트, 텍스처 풀, 시스템 버퍼를 파기합니다.

#### Returns

`void`

***

***

### getEffectAt()

> **getEffectAt**(`index`): [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

Defined in: [src/postEffect/PostEffectManager.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L232)

지정된 인덱스의 후처리 이펙트를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 인덱스 |

#### Returns

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

해당 인덱스의 후처리 이펙트 인스턴스

***

***

### removeAllEffect()

> **removeAllEffect**(): `void`

Defined in: [src/postEffect/PostEffectManager.ts:271](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L271)

등록된 모든 후처리 이펙트를 제거하고 리소스를 정리합니다.

#### Returns

`void`

***

***

### removeEffect()

> **removeEffect**(`v`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L244)

특정 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md) | 제거할 후처리 이펙트 인스턴스 |

#### Returns

`void`

***

***

### removeEffectAt()

> **removeEffectAt**(`index`): `void`

Defined in: [src/postEffect/PostEffectManager.ts:260](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L260)

지정된 인덱스의 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 이펙트의 인덱스 |

#### Returns

`void`

***

***

### render()

> **render**(): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/PostEffectManager.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/PostEffectManager.ts#L287)

전체 후처리 파이프라인을 실행하고 최종 출력 텍스처 정보를 반환합니다.

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

최종 렌더링 결과 텍스처 정보 (`IPostEffectResult`)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
