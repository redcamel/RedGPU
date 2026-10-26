[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L36)

Class that performs auto-exposure and eye adaptation via compute-shader-based 256-bin log-luminance histogram analysis. Automatically created inside `PostEffectManager`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via postEffectManager of View3D
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

Initializes an `AutoExposure` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |

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

Gets or sets the eye adaptation speed when transitioning from bright to dark environments. (Min `0`, Default: `1.0`)

##### Returns

`number`

Darkening adaptation speed

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

Gets or sets the eye adaptation speed when transitioning from dark to bright environments. (Min `0`, Default: `3.0`)

##### Returns

`number`

Brightening adaptation speed

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

Returns the GPU `StorageBuffer` instance storing the adapted EV100 value.

##### Returns

[`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

Adapted EV100 `StorageBuffer`

***

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L281)

Gets or sets the currently adapted EV100 value. Setting this value immediately updates the internal GPU storage buffer.

##### Returns

`number`

Currently adapted EV100 value

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

Gets or sets the exposure compensation value in EV stops. (Default: `0.0`)

##### Returns

`number`

Exposure compensation value in EV

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

Gets or sets the upper percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.95`)

##### Returns

`number`

High percentile value (`0` to `1`)

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

Gets or sets the lower percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)

##### Returns

`number`

Low percentile value (`0` to `1`)

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

Gets or sets the maximum EV100 upper bound allowed by auto-exposure. (Default: `16.0`)

##### Returns

`number`

Maximum EV100 value

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

Gets or sets the maximum exposure amplification multiplier allowed in dark scenes. (Min `1.0`, Default: `64.0`)

##### Returns

`number`

Maximum exposure amplification multiplier

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

Gets or sets the metering mode (`METERING_MODE`) used when measuring screen luminance. (Default: `METERING_MODE.AVERAGE`)

##### Returns

[`METERING_MODE`](../type-aliases/METERING_MODE.md)

Current metering mode

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

Gets or sets the minimum EV100 lower bound allowed by auto-exposure. (Default: `-2.0`)

##### Returns

`number`

Minimum EV100 value

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

Returns the pre-exposure multiplier (`preExposure`) calculated from the camera's current `ev100` and `exposureCompensation`.

##### Returns

`number`

Pre-exposure multiplier

***

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L116)

Gets or sets the target average luminance (based on 18% middle gray) toward which auto-exposure converges. (Min `0`, Default: `0.18`)

##### Returns

`number`

Target luminance value

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

Releases all allocated GPU buffers and compute pipeline resources.

#### Returns

`void`

***

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L313)

Records the log-luminance histogram generation and eye adaptation compute passes for the source color texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Post-processing input texture information (`IPostEffectResult`) |

#### Returns

`void`

***

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:406](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/autoExposure/AutoExposure.ts#L406)

Asynchronously maps the readback buffer to synchronize the GPU-computed adapted EV100 value to CPU state.

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
