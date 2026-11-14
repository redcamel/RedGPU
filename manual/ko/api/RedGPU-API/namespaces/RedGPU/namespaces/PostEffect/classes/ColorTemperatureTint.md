[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / ColorTemperatureTint

# Class: ColorTemperatureTint

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:11](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L11)

캘빈(Kelvin) 색온도와 틴트를 기반으로 이미지의 화이트 밸런스 및 전체 색감을 조절하는 후처리 이펙트입니다.

***

### Example
```typescript
const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
effect.temperature = 3200;
effect.tint = -10;
effect.amount = 0.8;
view.postEffectManager.addEffect(effect);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/" />

## See

[ColorTemperatureTint example](https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/)

## Extends

- [`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md)

## Constructors



***

### Constructor

> **new ColorTemperatureTint**(`redGPUContext`): `ColorTemperatureTint`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:65](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L65)

ColorTemperatureTint 인스턴스를 생성합니다.

#### Example
```typescript
const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`ColorTemperatureTint`

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#constructor)

## Properties



***

### amount

> **amount**: `number` = `1`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:17](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L17)

효과 적용 강도 (0 ~ 1)

***

***

### temperature

> **temperature**: `number` = `6500`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L23)

색온도 값 (단위: 캘빈, 1000 ~ 20000)

***

***

### tint

> **tint**: `number` = `0`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:29](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L29)

틴트 조절 값 (-100 ~ 100)

## Accessors



## Methods



***

### setCandleLight()

> **setCandleLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:119](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L119)

촛불 조명 프리셋(1900K, 틴트 -5)을 적용합니다.

#### Returns

`void`

***

***

### setCloudyDay()

> **setCloudyDay**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L137)

흐린 날 프리셋(7500K, 틴트 5)을 적용합니다.

#### Returns

`void`

***

***

### setCoolTone()

> **setCoolTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L101)

차가운 색감 프리셋(8000K, 틴트 10)을 적용합니다.

#### Returns

`void`

***

***

### setDaylight()

> **setDaylight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:128](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L128)

맑은 날 주간광 프리셋(5600K, 틴트 0)을 적용합니다.

#### Returns

`void`

***

***

### setNeonLight()

> **setNeonLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:146](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L146)

네온 조명 프리셋(9000K, 틴트 15)을 적용합니다.

#### Returns

`void`

***

***

### setNeutral()

> **setNeutral**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:110](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L110)

표준 주간광 프리셋(6500K, 틴트 0)을 적용합니다.

#### Returns

`void`

***

***

### setWarmTone()

> **setWarmTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L92)

따뜻한 색감 프리셋(3200K, 틴트 -10)을 적용합니다.

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L22)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#isinstanceofposteffect)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#antialiasingmanager)

***

***

### blendState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendState**(): `GPUBlendState`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L125)

렌더 파이프라인의 하드웨어 블렌딩 상태(`GPUBlendState`)를 반환합니다.

##### Returns

`GPUBlendState`

하드웨어 블렌딩 상태

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`blendState`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#blendstate)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#commandencodermanager)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#gpudevice)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:113](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L113)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#isldr)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`name`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#name)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#redgpucontext)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L149)

WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#shaderinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L161)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:173](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L173)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#uniformsinfo)

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

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L137)

이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:181](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L181)

캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`clear`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:192](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L192)

이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`destroy`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#destroy)

***

***

### init()

> **init**(`redGPUContext`, `name`, `shaderCode`): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:220](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L220)

렌더 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `shaderCode` | `string` | 렌더 셰이더 WGSL 코드 문자열 |

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`init`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:171](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L171)

색온도 및 색조(Temperature & Tint) 조절 효과를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | 입력 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

색온도 및 색조가 적용된 결과 텍스처 정보 (`IPostEffectResult`)

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`render`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#render)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:324](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L324)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASingleRenderPassPostEffect.md#updateuniform)

</details>
