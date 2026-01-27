[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [RedGPUContext](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:11](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L11)

GPU 어댑터 및 브라우저 환경을 감지하고 분석하는 클래스입니다.


Adapter 정보, 제한값(Limits), Fallback 여부, 모바일 환경 여부 등을 제공합니다.


## Constructors

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:35](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L35)

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

Defined in: [src/context/core/RedGPUContextDetector.ts:44](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L44)

현재 사용중인 GPUAdapter의 정보를 반환합니다.


##### Returns

`GPUAdapterInfo`

***

### groupedLimits

#### Get Signature

> **get** **groupedLimits**(): `any`

Defined in: [src/context/core/RedGPUContextDetector.ts:68](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L68)

그룹화된 한계값 정보를 반환합니다.


##### Returns

`any`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:60](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L60)

현재 어댑터가 Fallback 어댑터인지 여부를 반환합니다.


##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:84](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L84)

모바일 디바이스인지 여부를 반환합니다.


##### Returns

`boolean`

***

### limits

#### Get Signature

> **get** **limits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:52](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L52)

현재 사용 중인 GPU의 한계값을 반환합니다.


##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:76](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/context/core/RedGPUContextDetector.ts#L76)

브라우저의 User-Agent 문자열을 반환합니다.


##### Returns

`string`
