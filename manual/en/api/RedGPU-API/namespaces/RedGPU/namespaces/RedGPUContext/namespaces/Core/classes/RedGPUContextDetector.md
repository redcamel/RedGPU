[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [RedGPUContext](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:11](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L11)


Class that detects and analyzes the GPU adapter and browser environment.


Provides adapter information, limits, fallback status, mobile environment status, etc.

## Constructors

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:35](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L35)


RedGPUContextDetector constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`RedGPUContextDetector`

## Accessors

### adapterInfo

#### Get Signature

> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:44](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L44)


Returns information about the currently used GPUAdapter.

##### Returns

`GPUAdapterInfo`

***

### groupedLimits

#### Get Signature

> **get** **groupedLimits**(): `any`

Defined in: [src/context/core/RedGPUContextDetector.ts:68](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L68)


Returns grouped limit information.

##### Returns

`any`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:60](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L60)


Returns whether the current adapter is a fallback adapter.

##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:84](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L84)


Returns whether it is a mobile device.

##### Returns

`boolean`

***

### limits

#### Get Signature

> **get** **limits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:52](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L52)


Returns the supported limits of the currently used GPU.

##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:76](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/context/core/RedGPUContextDetector.ts#L76)


Returns the browser's User-Agent string.

##### Returns

`string`
