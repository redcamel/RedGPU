[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L24)


Class that detects and analyzes the GPU adapter and browser environment.


Provides adapter information, limits, fallback status, mobile environment status, etc.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/context/core/RedGPUContextDetector.ts:48](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L48)


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

Defined in: [src/context/core/RedGPUContextDetector.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L57)


Returns information about the currently used GPUAdapter.

##### Returns

`GPUAdapterInfo`

***

### groupedLimits

#### Get Signature

> **get** **groupedLimits**(): `any`

Defined in: [src/context/core/RedGPUContextDetector.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L81)


Returns grouped limit information.

##### Returns

`any`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L73)


Returns whether the current adapter is a fallback adapter.

##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:97](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L97)


Returns whether it is a mobile device.

##### Returns

`boolean`

***

### limits

#### Get Signature

> **get** **limits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L65)


Returns the supported limits of the currently used GPU.

##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:89](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/context/core/RedGPUContextDetector.ts#L89)


Returns the browser's User-Agent string.

##### Returns

`string`
