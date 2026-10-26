[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L36)

컴퓨트 셰이더 기반 256-bin 로그 휘도 히스토그램 분석을 통해 자동 노출(Auto-Exposure)과 눈 적응(Eye Adaptation)을 수행하는 클래스입니다. `PostEffectManager` 내부에서 자동으로 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 postEffectManager를 통해 접근
const autoExposure = view.postEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5;
autoExposure.meteringMode = RedGPU.Camera.Core.METERING_MODE.CENTER_WEIGHTED;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new AutoExposure**(`view`): `AutoExposure`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L84)

`AutoExposure` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |

#### Returns

`AutoExposure`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### adaptationSpeedDown

#### Get Signature

> **get** **adaptationSpeedDown**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L184)

밝은 곳에서 어두운 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)

##### Returns

`number`

어두워질 때의 적응 속도

#### Set Signature

> **set** **adaptationSpeedDown**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L188)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### adaptationSpeedUp

#### Get Signature

> **get** **adaptationSpeedUp**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L167)

어두운 곳에서 밝은 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)

##### Returns

`number`

밝아질 때의 적응 속도

#### Set Signature

> **set** **adaptationSpeedUp**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### adaptedLuminanceBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **adaptedLuminanceBuffer**(): [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L301)

적응된 EV100 값이 기록되는 GPU `StorageBuffer` 인스턴스를 반환합니다.

##### Returns

[`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

적응된 EV100 `StorageBuffer`

***

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L281)

현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 스토리지 버퍼도 즉시 갱신됩니다.

##### Returns

`number`

현재 적응된 EV100 값

#### Set Signature

> **set** **currentAdaptedEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L285)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### exposureCompensation

#### Get Signature

> **get** **exposureCompensation**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L99)

EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. (기본값: `0.0`)

##### Returns

`number`

노출 보정 값 (EV)

#### Set Signature

> **set** **exposureCompensation**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L103)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### highPercentile

#### Get Signature

> **get** **highPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L218)

히스토그램 평균 산출 시 제외할 상위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.95`)

##### Returns

`number`

상위 백분위 값 (`0` ~ `1`)

#### Set Signature

> **set** **highPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L222)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lowPercentile

#### Get Signature

> **get** **lowPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L201)

히스토그램 평균 산출 시 제외할 하위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)

##### Returns

`number`

하위 백분위 값 (`0` ~ `1`)

#### Set Signature

> **set** **lowPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L205)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEV100

#### Get Signature

> **get** **maxEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L150)

자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. (기본값: `16.0`)

##### Returns

`number`

최대 EV100 값

#### Set Signature

> **set** **maxEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L154)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxExposureMultiplier

#### Get Signature

> **get** **maxExposureMultiplier**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L235)

어두운 장면에서 허용할 최대 노출 증폭 배율을 가져오거나 설정합니다. (`1.0` 이상, 기본값: `64.0`)

##### Returns

`number`

최대 노출 증폭 배율

#### Set Signature

> **set** **maxExposureMultiplier**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### meteringMode

#### Get Signature

> **get** **meteringMode**(): [`METERING_MODE`](../type-aliases/METERING_MODE.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:252](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L252)

화면 휘도 측정 시 사용할 측광 모드(`METERING_MODE`)를 가져오거나 설정합니다. (기본값: `METERING_MODE.AVERAGE`)

##### Returns

[`METERING_MODE`](../type-aliases/METERING_MODE.md)

현재 측광 모드

#### Set Signature

> **set** **meteringMode**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L256)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`METERING_MODE`](../type-aliases/METERING_MODE.md) |

##### Returns

`void`

***

***

### minEV100

#### Get Signature

> **get** **minEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:133](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L133)

자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. (기본값: `-2.0`)

##### Returns

`number`

최소 EV100 값

#### Set Signature

> **set** **minEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### preExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **preExposure**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:268](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L268)

카메라의 현재 `ev100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.

##### Returns

`number`

사전 노출 배율

***

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L116)

자동 노출이 수렴하려는 목표 평균 휘도(18% 미들 그레이 기준)를 가져오거나 설정합니다. (`0` 이상, 기본값: `0.18`)

##### Returns

`number`

목표 휘도 값

#### Set Signature

> **set** **targetLuminance**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L120)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:428](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L428)

할당된 GPU 버퍼 및 컴퓨트 파이프라인 리소스를 모두 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L313)

소스 컬러 텍스처의 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 후처리 입력 텍스처 정보 (`IPostEffectResult`) |

#### Returns

`void`

***

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:406](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L406)

GPU에서 계산된 적응형 EV100 값을 리드백 버퍼로부터 비동기 매핑하여 CPU 상태에 동기화합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
