[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextDetector

# Class: RedGPUContextDetector

Defined in: [src/context/core/RedGPUContextDetector.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L15)

Class that detects and analyzes GPU adapter/device features and limits, as well as browser, platform, and hardware environments.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new RedGPUContextDetector**(`redGPUContext`): `RedGPUContextDetector`

Defined in: [src/context/core/RedGPUContextDetector.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L43)

Creates a RedGPUContextDetector instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`RedGPUContextDetector`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### activeFeatures

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L129)

Returns a map (`Record<string, boolean>`) of all known features and whether they are active on the GPU device.

##### Returns

`Record`\<`string`, `boolean`\>

Feature activation map of the GPU device

***

***

### activeLimits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L153)

Returns the limits (`GPUSupportedLimits`) active on the GPU device.

##### Returns

`GPUSupportedLimits`

Active limits of the GPU device

***

***

### adapterInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **adapterInfo**(): `GPUAdapterInfo`

Defined in: [src/context/core/RedGPUContextDetector.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L177)

Returns the GPU adapter information.

##### Returns

`GPUAdapterInfo`

`GPUAdapterInfo` instance

***

***

### deviceMemory

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **deviceMemory**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:297](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L297)

Returns the approximate device memory capacity in GB (default: 4).

##### Returns

`number`

Device memory capacity (GB)

***

***

### gpuAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/core/RedGPUContextDetector.ts:165](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L165)

Returns the GPU adapter object.

##### Returns

`GPUAdapter`

`GPUAdapter` instance

***

***

### hardwareConcurrency

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hardwareConcurrency**(): `number`

Defined in: [src/context/core/RedGPUContextDetector.ts:285](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L285)

Returns the number of logical processor cores (default: 4).

##### Returns

`number`

Number of logical processor cores

***

***

### isAndroid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isAndroid**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L237)

Returns whether the operating system is Android.

##### Returns

`boolean`

Whether it is Android

***

***

### isChromium

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isChromium**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L249)

Returns whether the browser is Chromium-based.

##### Returns

`boolean`

Whether it is a Chromium-based browser

***

***

### isFallbackAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isFallbackAdapter**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:189](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L189)

Returns whether the adapter is a fallback adapter (e.g., software renderer).

##### Returns

`boolean`

Whether it is a fallback adapter

***

***

### isFirefox

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isFirefox**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:273](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L273)

Returns whether the browser is Firefox.

##### Returns

`boolean`

Whether it is Firefox

***

***

### isIOS

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIOS**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L225)

Returns whether the operating system is iOS.

##### Returns

`boolean`

Whether it is iOS

***

***

### isMobile

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMobile**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L213)

Returns whether the current environment is mobile (smartphones, tablets, etc.).

##### Returns

`boolean`

Whether it is a mobile environment

***

***

### isSafari

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isSafari**(): `boolean`

Defined in: [src/context/core/RedGPUContextDetector.ts:261](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L261)

Returns whether the browser is Safari.

##### Returns

`boolean`

Whether it is Safari

***

***

### supportedFeatures

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **supportedFeatures**(): `Record`\<`string`, `boolean`\>

Defined in: [src/context/core/RedGPUContextDetector.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L117)

Returns a map (`Record<string, boolean>`) of all known features and whether they are supported by the GPU adapter.

##### Returns

`Record`\<`string`, `boolean`\>

Feature support map of the GPU adapter

***

***

### supportedLimits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **supportedLimits**(): `GPUSupportedLimits`

Defined in: [src/context/core/RedGPUContextDetector.ts:141](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L141)

Returns the limits (`GPUSupportedLimits`) supported by the GPU adapter.

##### Returns

`GPUSupportedLimits`

Supported limits of the GPU adapter

***

***

### userAgent

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **userAgent**(): `string`

Defined in: [src/context/core/RedGPUContextDetector.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L201)

Returns the browser's UserAgent string.

##### Returns

`string`

UserAgent string

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/core/RedGPUContextDetector.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L305)

Destroys the RedGPUContextDetector instance and releases internal GPU and environment references.

#### Returns

`void`

***

***

### toReport()

> **toReport**(): `object`

Defined in: [src/context/core/RedGPUContextDetector.ts:325](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L325)

Returns a comprehensive report object containing detected platform, browser, hardware, and GPU information.

#### Returns

`object`

Report object containing platform, browser, hardware, and GPU information

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `browser` | `object` | [src/context/core/RedGPUContextDetector.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L333) |
| `browser.isChromium` | `boolean` | [src/context/core/RedGPUContextDetector.ts:334](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L334) |
| `browser.isFirefox` | `boolean` | [src/context/core/RedGPUContextDetector.ts:336](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L336) |
| `browser.isSafari` | `boolean` | [src/context/core/RedGPUContextDetector.ts:335](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L335) |
| `gpu` | `object` | [src/context/core/RedGPUContextDetector.ts:342](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L342) |
| `gpu.activeFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:349](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L349) |
| `gpu.activeLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L351) |
| `gpu.architecture` | `string` | [src/context/core/RedGPUContextDetector.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L344) |
| `gpu.description` | `string` | [src/context/core/RedGPUContextDetector.ts:346](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L346) |
| `gpu.device` | `string` | [src/context/core/RedGPUContextDetector.ts:345](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L345) |
| `gpu.isFallback` | `boolean` | [src/context/core/RedGPUContextDetector.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L347) |
| `gpu.supportedFeatures` | `object` | [src/context/core/RedGPUContextDetector.ts:348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L348) |
| `gpu.supportedLimits` | `Record`\<`string`, `number`\> | [src/context/core/RedGPUContextDetector.ts:350](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L350) |
| `gpu.vendor` | `string` | [src/context/core/RedGPUContextDetector.ts:343](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L343) |
| `hardware` | `object` | [src/context/core/RedGPUContextDetector.ts:338](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L338) |
| `hardware.deviceMemory` | `number` | [src/context/core/RedGPUContextDetector.ts:340](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L340) |
| `hardware.hardwareConcurrency` | `number` | [src/context/core/RedGPUContextDetector.ts:339](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L339) |
| `platform` | `object` | [src/context/core/RedGPUContextDetector.ts:327](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L327) |
| `platform.isAndroid` | `boolean` | [src/context/core/RedGPUContextDetector.ts:330](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L330) |
| `platform.isIOS` | `boolean` | [src/context/core/RedGPUContextDetector.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L329) |
| `platform.isMobile` | `boolean` | [src/context/core/RedGPUContextDetector.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L328) |
| `platform.userAgent` | `string` | [src/context/core/RedGPUContextDetector.ts:331](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextDetector.ts#L331) |

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
