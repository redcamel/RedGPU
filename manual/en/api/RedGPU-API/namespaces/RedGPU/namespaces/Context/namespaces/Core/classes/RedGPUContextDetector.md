[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:12](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L12)

Class that detects and analyzes the GPU adapter and browser environment.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:38](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L38)

RedGPUContextDetector constructor

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

Defined in: [src/context/core/RedGPUContextDetector.ts:122](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L122)

Returns a map of all known features and whether they are active on the GPU device.

##### Returns

`Record`\<`string`, `boolean`\>

***

### activeLimits

#### Get Signature

> **get** **activeLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:138](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L138)

Returns the limits active on the GPU device.

##### Returns

`GPUSupportedLimits`

***

### adapterInfo

#### Get Signature

> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:154](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L154)

Returns the GPU adapter information.

##### Returns

`GPUAdapterInfo`

***

### deviceMemory

#### Get Signature

> **get** **deviceMemory**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:234](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L234)

Returns the approximate device memory in GB. (default: 4)

##### Returns

`number`

***

### gpuAdapter

#### Get Signature

> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/core/RedGPUContextDetector.ts:146](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L146)

Returns the GPU adapter object.

##### Returns

`GPUAdapter`

***

### hardwareConcurrency

#### Get Signature

> **get** **hardwareConcurrency**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:226](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L226)

Returns the number of logical processor cores. (default: 4)

##### Returns

`number`

***

### isAndroid

#### Get Signature

> **get** **isAndroid**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:194](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L194)

Returns whether the operating system is Android.

##### Returns

`boolean`

***

### isChromium

#### Get Signature

> **get** **isChromium**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:202](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L202)

Returns whether it is a Chromium-based browser.

##### Returns

`boolean`

***

### isFallbackAdapter

#### Get Signature

> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:162](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L162)

Returns whether it is a fallback adapter (e.g., CPU software renderer).

##### Returns

`boolean`

***

### isFirefox

#### Get Signature

> **get** **isFirefox**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:218](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L218)

Returns whether the browser is Firefox.

##### Returns

`boolean`

***

### isIOS

#### Get Signature

> **get** **isIOS**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:186](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L186)

Returns whether the operating system is iOS.

##### Returns

`boolean`

***

### isMobile

#### Get Signature

> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:178](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L178)

Returns whether it is a mobile environment (smartphones, tablets, etc.).

##### Returns

`boolean`

***

### isSafari

#### Get Signature

> **get** **isSafari**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:210](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L210)

Returns whether the browser is Safari.

##### Returns

`boolean`

***

### supportedFeatures

#### Get Signature

> **get** **supportedFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:114](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L114)

Returns a map of all known features and whether they are supported by the GPU adapter.

##### Returns

`Record`\<`string`, `boolean`\>

***

### supportedLimits

#### Get Signature

> **get** **supportedLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:130](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L130)

Returns the limits supported by the GPU adapter.

##### Returns

`GPUSupportedLimits`

***

### userAgent

#### Get Signature

> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:170](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L170)

Returns the UserAgent string of the browser.

##### Returns

`string`

## Methods

### toReport()

> **toReport**(): `object`

Defined in: [src/context/core/RedGPUContextDetector.ts:245](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L245)

Returns all detected information as a report object.

#### Returns

`object`

Report object containing platform, browser, hardware, and GPU information

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `browser` | `object` | [src/context/core/RedGPUContextDetector.ts:253](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L253) |
| `browser.isChromium` | `boolean` | [src/context/core/RedGPUContextDetector.ts:254](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L254) |
| `browser.isFirefox` | `boolean` | [src/context/core/RedGPUContextDetector.ts:256](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L256) |
| `browser.isSafari` | `boolean` | [src/context/core/RedGPUContextDetector.ts:255](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L255) |
| `gpu` | `object` | [src/context/core/RedGPUContextDetector.ts:262](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L262) |
| `gpu.activeFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:269](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L269) |
| `gpu.activeLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:271](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L271) |
| `gpu.architecture` | `string` | [src/context/core/RedGPUContextDetector.ts:264](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L264) |
| `gpu.description` | `string` | [src/context/core/RedGPUContextDetector.ts:266](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L266) |
| `gpu.device` | `string` | [src/context/core/RedGPUContextDetector.ts:265](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L265) |
| `gpu.isFallback` | `boolean` | [src/context/core/RedGPUContextDetector.ts:267](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L267) |
| `gpu.supportedFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:268](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L268) |
| `gpu.supportedLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:270](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L270) |
| `gpu.vendor` | `string` | [src/context/core/RedGPUContextDetector.ts:263](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L263) |
| `hardware` | `object` | [src/context/core/RedGPUContextDetector.ts:258](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L258) |
| `hardware.deviceMemory` | `number` | [src/context/core/RedGPUContextDetector.ts:260](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L260) |
| `hardware.hardwareConcurrency` | `number` | [src/context/core/RedGPUContextDetector.ts:259](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L259) |
| `platform` | `object` | [src/context/core/RedGPUContextDetector.ts:247](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L247) |
| `platform.isAndroid` | `boolean` | [src/context/core/RedGPUContextDetector.ts:250](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L250) |
| `platform.isIOS` | `boolean` | [src/context/core/RedGPUContextDetector.ts:249](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L249) |
| `platform.isMobile` | `boolean` | [src/context/core/RedGPUContextDetector.ts:248](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L248) |
| `platform.userAgent` | `string` | [src/context/core/RedGPUContextDetector.ts:251](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/context/core/RedGPUContextDetector.ts#L251) |
