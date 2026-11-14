[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / SSAO

# Class: SSAO

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L34)

Ground Truth Ambient Occlusion (GTAO), Edge-Stopping Bilateral Denoiser, 및 Multi-Bounce를 기반으로 고품질 화면 공간 주변광 차폐 음영을 생성하는 SSAO 후처리 이펙트입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 builtInEffectManager를 통해 SSAO 활성화 및 설정 제어
view.builtInEffectManager.useSSAO = true;
const ssao = view.builtInEffectManager.ssao;
ssao.radius = 0.5;
ssao.intensity = 1.5;
ssao.useMultiBounce = true;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/" />

## See

[SSAO example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new SSAO**(`redGPUContext`): `SSAO`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L49)

SSAO 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`SSAO`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### bias

#### Get Signature

> **get** **bias**(): `number` = `0.01`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:140](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L140)

자기 차폐(Self-occlusion) 현상을 방지하기 위한 깊이 바이어스 값(0.0 ~ 0.1)을 반환하거나 설정합니다.

##### Returns

`number`

깊이 바이어스

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:144](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L144)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### biasDistanceScale

#### Get Signature

> **get** **biasDistanceScale**(): `number` = `0.01`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:157](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L157)

카메라 거리에 비례하여 적용되는 바이어스 스케일 계수(0.0 ~ 0.5)를 반환하거나 설정합니다.

##### Returns

`number`

거리별 바이어스 스케일

#### Set Signature

> **set** **biasDistanceScale**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L161)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### contrast

#### Get Signature

> **get** **contrast**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:208](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L208)

AO 음영의 대비(0.5 ~ 4.0)를 반환하거나 설정합니다.

##### Returns

`number`

대비 값

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:212](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L212)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeDistanceRange

#### Get Signature

> **get** **fadeDistanceRange**(): `number` = `50.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:191](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L191)

AO 효과가 완전히 사라지기까지의 페이드 거리 구간 길이(1.0 ~ 100.0)를 반환하거나 설정합니다.

##### Returns

`number`

페이드 거리 범위

#### Set Signature

> **set** **fadeDistanceRange**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:195](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeDistanceStart

#### Get Signature

> **get** **fadeDistanceStart**(): `number` = `30.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:174](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L174)

AO 효과가 감쇠되기 시작하는 카메라 거리(1.0 ~ 200.0)를 반환하거나 설정합니다.

##### Returns

`number`

페이드 시작 거리

#### Set Signature

> **set** **fadeDistanceStart**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:178](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### intensity

#### Get Signature

> **get** **intensity**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:123](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L123)

AO 음영의 강도(0 ~ 10)를 반환하거나 설정합니다.

##### Returns

`number`

AO 강도

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:127](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L127)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### radius

#### Get Signature

> **get** **radius**(): `number` = `0.5`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:106](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L106)

차폐를 계산할 월드 단위 샘플링 반경(0.01 ~ 5.0)을 반환하거나 설정합니다.

##### Returns

`number`

샘플링 반경

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:110](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L110)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useBlur

#### Get Signature

> **get** **useBlur**(): `boolean` = `true`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:72](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L72)

깊이·법선 경계를 보존하는 Edge-Stopping Bilateral 디노이저 패스 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

디노이저 블러 사용 여부

#### Set Signature

> **set** **useBlur**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:76](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L76)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useMultiBounce

#### Get Signature

> **get** **useMultiBounce**(): `boolean` = `true`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L89)

알베도 색감을 보존하는 GTAO 다중 반사(Multi-Bounce) 적용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

다중 반사 적용 여부

#### Set Signature

> **set** **useMultiBounce**(`value`): `void`

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/ssao/SSAO.ts:237](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/ssao/SSAO.ts#L237)

SSAO 다중 패스 후처리 효과를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 원본 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

SSAO가 합성된 후처리 결과 (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L14)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../../Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../../Core/classes/AMultiPassPostEffect.md#commandencodermanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../../Core/classes/AMultiPassPostEffect.md#gpudevice)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`instanceId`](../../Core/classes/AMultiPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L68)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isLdr`](../../Core/classes/AMultiPassPostEffect.md#isldr)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`name`](../../Core/classes/AMultiPassPostEffect.md#name)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): ([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L93)

등록된 내부 단일 패스 이펙트 배열을 반환합니다.

##### Returns

([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

내부 단일 패스 이펙트 배열 (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`passList`](../../Core/classes/AMultiPassPostEffect.md#passlist)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../../Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../../Core/classes/AMultiPassPostEffect.md#resourcemanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`uuid`](../../Core/classes/AMultiPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L80)

모든 내부 패스의 비디오 메모리 사용량 합계(바이트)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../../Core/classes/AMultiPassPostEffect.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L115)

등록된 모든 내부 패스의 캐시 리소스를 비웁니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`clear`](../../Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L101)

모든 내부 패스 이펙트와 할당된 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`destroy`](../../Core/classes/AMultiPassPostEffect.md#destroy)

***

</details>
