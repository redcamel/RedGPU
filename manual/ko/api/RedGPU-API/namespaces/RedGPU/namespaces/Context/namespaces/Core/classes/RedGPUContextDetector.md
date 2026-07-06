[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:12](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L12)

GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:38](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L38)

RedGPUContextDetector 생성자

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) |

#### Returns

`RedGPUContextDetector`

## Accessors

### activeFeatures

#### Get Signature

> **get** **activeFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:122](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L122)

GPU 디바이스에 실제 활성화된 기능 목록의 키와 활성화 여부 맵을 반환합니다.

##### Returns

`Record`\<`string`, `boolean`\>

***

### activeLimits

#### Get Signature

> **get** **activeLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:138](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L138)

GPU 디바이스의 한계 제한치(Limits)를 반환합니다.

##### Returns

`GPUSupportedLimits`

***

### adapterInfo

#### Get Signature

> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:154](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L154)

GPU 어댑터 정보를 반환합니다.

##### Returns

`GPUAdapterInfo`

***

### deviceMemory

#### Get Signature

> **get** **deviceMemory**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:234](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L234)

장치 메모리 용량을 대략적인 GB 단위로 반환합니다. (기본값: 4)

##### Returns

`number`

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/core/RedGPUContextDetector.ts:146](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L146)

GPU 어댑터 객체를 반환합니다.

##### Returns

`GPUAdapter`

***

### hardwareConcurrency

#### Get Signature

> **get** **hardwareConcurrency**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:226](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L226)

논리 프로세서 코어 개수를 반환합니다. (기본값: 4)

##### Returns

`number`

***

### isAndroid

#### Get Signature

> **get** **isAndroid**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:194](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L194)

Android 운영체제 여부를 반환합니다.

##### Returns

`boolean`

***

### isChromium

#### Get Signature

> **get** **isChromium**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:202](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L202)

Chromium 기반 브라우저 여부를 반환합니다.

##### Returns

`boolean`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:162](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L162)

폴백 어댑터(Fallback Adapter) 여부를 반환합니다. (예: CPU 소프트웨어 렌더러)

##### Returns

`boolean`

***

### isFirefox

#### Get Signature

> **get** **isFirefox**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:218](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L218)

Firefox 브라우저 여부를 반환합니다.

##### Returns

`boolean`

***

### isIOS

#### Get Signature

> **get** **isIOS**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:186](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L186)

iOS 운영체제 여부를 반환합니다.

##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:178](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L178)

모바일 환경(스마트폰, 태블릿 등) 여부를 반환합니다.

##### Returns

`boolean`

***

### isSafari

#### Get Signature

> **get** **isSafari**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:210](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L210)

Safari 브라우저 여부를 반환합니다.

##### Returns

`boolean`

***

### supportedFeatures

#### Get Signature

> **get** **supportedFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:114](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L114)

GPU 어댑터가 지원하는 전체 기능 목록의 키와 지원 여부 맵을 반환합니다.

##### Returns

`Record`\<`string`, `boolean`\>

***

### supportedLimits

#### Get Signature

> **get** **supportedLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:130](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L130)

GPU 어댑터의 한계 제한치(Limits)를 반환합니다.

##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:170](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L170)

브라우저의 UserAgent 문자열을 반환합니다.

##### Returns

`string`

## Methods

### toReport()

> **toReport**(): `object`

Defined in: [src/context/core/RedGPUContextDetector.ts:245](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L245)

모든 탐지된 정보를 리포트 객체로 반환합니다.

#### Returns

`object`

플랫폼, 브라우저, 하드웨어, GPU 정보가 포함된 리포트 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `browser` | `object` | [src/context/core/RedGPUContextDetector.ts:253](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L253) |
| `browser.isChromium` | `boolean` | [src/context/core/RedGPUContextDetector.ts:254](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L254) |
| `browser.isFirefox` | `boolean` | [src/context/core/RedGPUContextDetector.ts:256](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L256) |
| `browser.isSafari` | `boolean` | [src/context/core/RedGPUContextDetector.ts:255](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L255) |
| `gpu` | `object` | [src/context/core/RedGPUContextDetector.ts:262](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L262) |
| `gpu.activeFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:269](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L269) |
| `gpu.activeLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:271](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L271) |
| `gpu.architecture` | `string` | [src/context/core/RedGPUContextDetector.ts:264](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L264) |
| `gpu.description` | `string` | [src/context/core/RedGPUContextDetector.ts:266](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L266) |
| `gpu.device` | `string` | [src/context/core/RedGPUContextDetector.ts:265](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L265) |
| `gpu.isFallback` | `boolean` | [src/context/core/RedGPUContextDetector.ts:267](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L267) |
| `gpu.supportedFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:268](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L268) |
| `gpu.supportedLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:270](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L270) |
| `gpu.vendor` | `string` | [src/context/core/RedGPUContextDetector.ts:263](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L263) |
| `hardware` | `object` | [src/context/core/RedGPUContextDetector.ts:258](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L258) |
| `hardware.deviceMemory` | `number` | [src/context/core/RedGPUContextDetector.ts:260](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L260) |
| `hardware.hardwareConcurrency` | `number` | [src/context/core/RedGPUContextDetector.ts:259](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L259) |
| `platform` | `object` | [src/context/core/RedGPUContextDetector.ts:247](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L247) |
| `platform.isAndroid` | `boolean` | [src/context/core/RedGPUContextDetector.ts:250](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L250) |
| `platform.isIOS` | `boolean` | [src/context/core/RedGPUContextDetector.ts:249](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L249) |
| `platform.isMobile` | `boolean` | [src/context/core/RedGPUContextDetector.ts:248](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L248) |
| `platform.userAgent` | `string` | [src/context/core/RedGPUContextDetector.ts:251](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/context/core/RedGPUContextDetector.ts#L251) |
