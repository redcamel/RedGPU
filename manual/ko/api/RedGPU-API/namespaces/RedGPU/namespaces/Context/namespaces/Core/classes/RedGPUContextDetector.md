[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L15)

GPU 어댑터/디바이스의 기능 및 한계치(Limits)와 브라우저·플랫폼·하드웨어 환경을 감지하고 분석하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L43)

RedGPUContextDetector 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`RedGPUContextDetector`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### activeFeatures

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:129](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L129)

GPU 디바이스에 실제 활성화된 기능 여부 맵(`Record<string, boolean>`)을 반환합니다.

##### Returns

`Record`\<`string`, `boolean`\>

기능별 디바이스 활성화 여부 맵

***

***

### activeLimits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L153)

GPU 디바이스에 적용된 한계 제한치(`GPUSupportedLimits`)를 반환합니다.

##### Returns

`GPUSupportedLimits`

GPU 디바이스 활성 한계치

***

***

### adapterInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:177](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L177)

GPU 어댑터 정보를 반환합니다.

##### Returns

`GPUAdapterInfo`

`GPUAdapterInfo` 인스턴스

***

***

### deviceMemory

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **deviceMemory**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L297)

대략적인 장치 메모리 용량(GB 단위)을 반환합니다. (기본값: 4)

##### Returns

`number`

장치 메모리 용량 (GB)

***

***

### gpuAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/core/RedGPUContextDetector.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L165)

GPU 어댑터 객체를 반환합니다.

##### Returns

`GPUAdapter`

`GPUAdapter` 인스턴스

***

***

### hardwareConcurrency

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hardwareConcurrency**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L285)

논리 프로세서 코어 개수를 반환합니다. (기본값: 4)

##### Returns

`number`

논리 프로세서 코어 수

***

***

### isAndroid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isAndroid**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L237)

Android 운영체제 여부를 반환합니다.

##### Returns

`boolean`

Android 여부

***

***

### isChromium

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isChromium**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L249)

Chromium 기반 브라우저 여부를 반환합니다.

##### Returns

`boolean`

Chromium 기반 브라우저 여부

***

***

### isFallbackAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L189)

폴백 어댑터(소프트웨어 렌더러 등) 여부를 반환합니다.

##### Returns

`boolean`

폴백 어댑터 여부

***

***

### isFirefox

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isFirefox**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:273](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L273)

Firefox 브라우저 여부를 반환합니다.

##### Returns

`boolean`

Firefox 브라우저 여부

***

***

### isIOS

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIOS**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L225)

iOS 운영체제 여부를 반환합니다.

##### Returns

`boolean`

iOS 여부

***

***

### isMobile

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L213)

모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.

##### Returns

`boolean`

모바일 환경 여부

***

***

### isSafari

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isSafari**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L261)

Safari 브라우저 여부를 반환합니다.

##### Returns

`boolean`

Safari 브라우저 여부

***

***

### supportedFeatures

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **supportedFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L117)

GPU 어댑터가 지원하는 전체 기능의 지원 여부 맵(`Record<string, boolean>`)을 반환합니다.

##### Returns

`Record`\<`string`, `boolean`\>

기능별 어댑터 지원 여부 맵

***

***

### supportedLimits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **supportedLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L141)

GPU 어댑터가 지원하는 한계 제한치(`GPUSupportedLimits`)를 반환합니다.

##### Returns

`GPUSupportedLimits`

GPU 어댑터 지원 한계치

***

***

### userAgent

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L201)

브라우저의 UserAgent 문자열을 반환합니다.

##### Returns

`string`

UserAgent 문자열

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/core/RedGPUContextDetector.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L305)

RedGPUContextDetector 인스턴스를 파기하고 내부 GPU 및 환경 참조를 해제합니다.

#### Returns

`void`

***

***

### toReport()

> **toReport**(): `object`

Defined in: [src/context/core/RedGPUContextDetector.ts:325](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L325)

감지된 플랫폼, 브라우저, 하드웨어 및 GPU 정보를 종합한 리포트 객체를 반환합니다.

#### Returns

`object`

플랫폼, 브라우저, 하드웨어, GPU 정보가 포함된 리포트 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `browser` | `object` | [src/context/core/RedGPUContextDetector.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L333) |
| `browser.isChromium` | `boolean` | [src/context/core/RedGPUContextDetector.ts:334](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L334) |
| `browser.isFirefox` | `boolean` | [src/context/core/RedGPUContextDetector.ts:336](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L336) |
| `browser.isSafari` | `boolean` | [src/context/core/RedGPUContextDetector.ts:335](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L335) |
| `gpu` | `object` | [src/context/core/RedGPUContextDetector.ts:342](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L342) |
| `gpu.activeFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:349](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L349) |
| `gpu.activeLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L351) |
| `gpu.architecture` | `string` | [src/context/core/RedGPUContextDetector.ts:344](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L344) |
| `gpu.description` | `string` | [src/context/core/RedGPUContextDetector.ts:346](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L346) |
| `gpu.device` | `string` | [src/context/core/RedGPUContextDetector.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L345) |
| `gpu.isFallback` | `boolean` | [src/context/core/RedGPUContextDetector.ts:347](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L347) |
| `gpu.supportedFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:348](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L348) |
| `gpu.supportedLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:350](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L350) |
| `gpu.vendor` | `string` | [src/context/core/RedGPUContextDetector.ts:343](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L343) |
| `hardware` | `object` | [src/context/core/RedGPUContextDetector.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L338) |
| `hardware.deviceMemory` | `number` | [src/context/core/RedGPUContextDetector.ts:340](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L340) |
| `hardware.hardwareConcurrency` | `number` | [src/context/core/RedGPUContextDetector.ts:339](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L339) |
| `platform` | `object` | [src/context/core/RedGPUContextDetector.ts:327](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L327) |
| `platform.isAndroid` | `boolean` | [src/context/core/RedGPUContextDetector.ts:330](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L330) |
| `platform.isIOS` | `boolean` | [src/context/core/RedGPUContextDetector.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L329) |
| `platform.isMobile` | `boolean` | [src/context/core/RedGPUContextDetector.ts:328](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L328) |
| `platform.userAgent` | `string` | [src/context/core/RedGPUContextDetector.ts:331](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextDetector.ts#L331) |

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

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../classes/RedGPUContext.md)

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
