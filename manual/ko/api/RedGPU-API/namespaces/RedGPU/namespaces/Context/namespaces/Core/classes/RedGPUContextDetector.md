[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:24](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L24)

GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.


Adapter 정보, 제한값(Limits), Fallback 여부, 모바일 환경 여부 등을 제공합니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
const detector = redGPUContext.detector;
console.log('Is mobile:', detector.isMobile);
console.log('GPU Limits:', detector.limits);
```

## Constructors

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:48](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L48)

RedGPUContextDetector 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`RedGPUContextDetector`

## Accessors

### adapterInfo

#### Get Signature

> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:57](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L57)

현재 사용중인 GPUAdapter의 정보를 반환합니다.


##### Returns

`GPUAdapterInfo`

***

### groupedLimits

#### Get Signature

> **get** **groupedLimits**(): `any`

Defined in: [src/context/core/RedGPUContextDetector.ts:81](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L81)

그룹화된 한계값 정보를 반환합니다.


##### Returns

`any`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:73](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L73)

현재 어댑터가 Fallback 어댑터인지 여부를 반환합니다.


##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:97](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L97)

모바일 디바이스인지 여부를 반환합니다.


##### Returns

`boolean`

***

### limits

#### Get Signature

> **get** **limits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:65](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L65)

현재 사용 중인 GPU의 한계값을 반환합니다.


##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:89](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/context/core/RedGPUContextDetector.ts#L89)

브라우저의 User-Agent 문자열을 반환합니다.


##### Returns

`string`
