[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L28)

착란원(CoC) 모델을 기반으로 초점 거리에 따른 블러와 보케(Bokeh)를 시뮬레이션하는 피사계 심도(DOF) 후처리 이펙트입니다.

***

### Example
```typescript
const effect = new RedGPU.PostEffect.DOF(redGPUContext);
effect.focusDistance = 10;
effect.aperture = 1.4;
effect.nearBlurSize = 20;
effect.farBlurSize = 25;
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/lens/dof/" style="width:100%; height:500px;"></iframe>

## See

[DOF example](https://redcamel.github.io/RedGPU/examples/postEffect/lens/dof/)

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L54)

DOF 인스턴스를 생성합니다.

#### Example
```typescript
const effect = new RedGPU.PostEffect.DOF(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### aperture

#### Get Signature

> **get** **aperture**(): `number` = `2.8`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L102)

조리개 값(F-number)을 반환하거나 설정합니다.

##### Returns

`number`

조리개 값 (F-number)

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### farBlurSize

#### Get Signature

> **get** **farBlurSize**(): `number` = `15`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:192](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L192)

원거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.

##### Returns

`number`

원거리 블러 크기 (단위: 픽셀)

#### Set Signature

> **set** **farBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### farPlane

#### Get Signature

> **get** **farPlane**(): `number` = `1000.0`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L156)

원평면 거리(0.1 이상)를 반환하거나 설정합니다.

##### Returns

`number`

원평면 거리

#### Set Signature

> **set** **farPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### farStrength

#### Get Signature

> **get** **farStrength**(): `number` = `1.0`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:228](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L228)

원거리 블러 강도를 반환하거나 설정합니다.

##### Returns

`number`

원거리 블러 강도

#### Set Signature

> **set** **farStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:232](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number` = `15.0`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L84)

초점 거리를 반환하거나 설정합니다.

##### Returns

`number`

초점 거리

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L88)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxCoC

#### Get Signature

> **get** **maxCoC**(): `number` = `25.0`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L120)

최대 착란원(CoC) 크기(0 ~ 100)를 반환하거나 설정합니다.

##### Returns

`number`

최대 CoC 크기

#### Set Signature

> **set** **maxCoC**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L124)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### nearBlurSize

#### Get Signature

> **get** **nearBlurSize**(): `number` = `15`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L174)

근거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.

##### Returns

`number`

근거리 블러 크기 (단위: 픽셀)

#### Set Signature

> **set** **nearBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### nearPlane

#### Get Signature

> **get** **nearPlane**(): `number` = `0.1`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L138)

근평면 거리(0 이상)를 반환하거나 설정합니다.

##### Returns

`number`

근평면 거리

#### Set Signature

> **set** **nearPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:142](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L142)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### nearStrength

#### Get Signature

> **get** **nearStrength**(): `number` = `1.0`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L210)

근거리 블러 강도를 반환하거나 설정합니다.

##### Returns

`number`

근거리 블러 강도

#### Set Signature

> **set** **nearStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:355](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L355)

DOF 다중 패스 후처리 효과를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | 입력 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

DOF 처리된 결과 텍스처 정보 (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L255)

시네마틱 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L241)

게임 기본 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:283](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L283)

풍경 사진 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L297)

매크로 촬영 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:325](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L325)

야간 촬영 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L269)

인물 사진 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/effects/lens/dof/DOF.ts#L311)

액션/스포츠 프리셋을 적용합니다.

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/AMultiPassPostEffect.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`instanceId`](../namespaces/Core/classes/AMultiPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L112)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`isLdr`](../namespaces/Core/classes/AMultiPassPostEffect.md#isldr)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`name`](../namespaces/Core/classes/AMultiPassPostEffect.md#name)

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L235)

현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 `GPUTextureView`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/AMultiPassPostEffect.md#outputtextureview)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/AMultiPassPostEffect.ts#L63)

등록된 내부 단일 패스 이펙트 배열을 반환합니다.

##### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

내부 단일 패스 이펙트 배열 (`ASinglePassPostEffect[]`)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/AMultiPassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L148)

현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#shaderinfo)

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L136)

파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 바인딩 구조 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#storageinfo)

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L184)

시스템 공용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조체 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#systemuniformsinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L160)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L172)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformsinfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uuid`](../namespaces/Core/classes/AMultiPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/AMultiPassPostEffect.ts#L50)

모든 내부 패스의 비디오 메모리 사용량 합계(바이트)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L197)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L210)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L223)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/AMultiPassPostEffect.ts#L83)

등록된 모든 내부 패스의 캐시 리소스를 비웁니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/AMultiPassPostEffect.ts#L71)

모든 내부 패스 이펙트와 할당된 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`destroy`](../namespaces/Core/classes/AMultiPassPostEffect.md#destroy)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L283)

MSAA/Non-MSAA 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드 객체 |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`init`](../namespaces/Core/classes/AMultiPassPostEffect.md#init)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L387)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/AMultiPassPostEffect.md#updateuniform)

</details>
