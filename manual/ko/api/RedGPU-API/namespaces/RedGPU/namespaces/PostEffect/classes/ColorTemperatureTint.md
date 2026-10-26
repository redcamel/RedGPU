[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / ColorTemperatureTint

# Class: ColorTemperatureTint

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:10](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L10)

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

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/" style="width:100%; height:500px;"></iframe>

## See

[ColorTemperatureTint example](https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/)

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors



***

### Constructor

> **new ColorTemperatureTint**(`redGPUContext`): `ColorTemperatureTint`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L64)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties



***

### amount

> **amount**: `number` = `1`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L16)

효과 적용 강도 (0 ~ 1)

***

***

### temperature

> **temperature**: `number` = `6500`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L22)

색온도 값 (단위: 캘빈, 1000 ~ 20000)

***

***

### tint

> **tint**: `number` = `0`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L28)

틴트 조절 값 (-100 ~ 100)

## Accessors



## Methods



***

### setCandleLight()

> **setCandleLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L108)

촛불 조명 프리셋(1900K, 틴트 -5)을 적용합니다.

#### Returns

`void`

***

***

### setCloudyDay()

> **setCloudyDay**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L126)

흐린 날 프리셋(7500K, 틴트 5)을 적용합니다.

#### Returns

`void`

***

***

### setCoolTone()

> **setCoolTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L90)

차가운 색감 프리셋(8000K, 틴트 10)을 적용합니다.

#### Returns

`void`

***

***

### setDaylight()

> **setDaylight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L117)

맑은 날 주간광 프리셋(5600K, 틴트 0)을 적용합니다.

#### Returns

`void`

***

***

### setNeonLight()

> **setNeonLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:135](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L135)

네온 조명 프리셋(9000K, 틴트 15)을 적용합니다.

#### Returns

`void`

***

***

### setNeutral()

> **setNeutral**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L99)

표준 주간광 프리셋(6500K, 틴트 0)을 적용합니다.

#### Returns

`void`

***

***

### setWarmTone()

> **setWarmTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L81)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L112)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../namespaces/Core/classes/ASinglePassPostEffect.md#name)

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L235)

현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 `GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L148)

현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L136)

파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 바인딩 구조 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L184)

시스템 공용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조체 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L160)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L172)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L124)

이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L197)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L210)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L223)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L243)

캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L255)

이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`destroy`](../namespaces/Core/classes/ASinglePassPostEffect.md#destroy)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L283)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L344)

텍스처 풀에서 출력 텍스처를 할당받아 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)[] | 입력 소스 텍스처 정보 목록 |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L387)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)

</details>
