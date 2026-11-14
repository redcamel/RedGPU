[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:47](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L47)

Class that performs auto-exposure and eye adaptation via compute-shader-based 256-bin log-luminance histogram analysis. Automatically created inside `BuiltInEffectManager`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via builtInEffectManager of View3D
const autoExposure = view.builtInEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5;
autoExposure.meteringMode = RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/autoExposure/" />

## See

[AutoExposure Example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new AutoExposure**(`view`): `AutoExposure`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:128](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L128)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L245)

Gets or sets the adaptation speed when transitioning from bright to dark environments (dark adaptation, EV100 decreasing). (Min `0`, Default: `1.0`)

##### Returns

`number`

Dark adaptation speed

#### Set Signature

> **set** **adaptationSpeedDown**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:249](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L249)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:228](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L228)

Gets or sets the adaptation speed when transitioning from dark to bright environments (light adaptation, EV100 increasing). (Min `0`, Default: `3.0`)

##### Returns

`number`

Light adaptation speed

#### Set Signature

> **set** **adaptationSpeedUp**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:410](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L410)

Gets or sets the currently adapted EV100 value. Setting this value immediately synchronizes the internal GPU state buffer.

##### Returns

`number`

Currently adapted EV100 value

#### Set Signature

> **set** **currentAdaptedEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:414](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L414)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### effectiveEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **effectiveEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:374](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L374)

Returns the effective EV100 (`currentAdaptedEV100 - exposureCompensation`) after applying exposure compensation.

##### Returns

`number`

Effective EV100 value

***

***

### exposureCompensation

#### Get Signature

> **get** **exposureCompensation**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:152](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L152)

Gets or sets the exposure compensation value in EV stops. Positive values brighten the image. (Default: `0.0`)

##### Returns

`number`

Exposure compensation value in EV

#### Set Signature

> **set** **exposureCompensation**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:156](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L156)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:279](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L279)

Gets or sets the upper highlight percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.983`)

##### Returns

`number`

High percentile value (`0` to `1`)

#### Set Signature

> **set** **highPercentile**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:283](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L283)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:262](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L262)

Gets or sets the lower shadow percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)

##### Returns

`number`

Low percentile value (`0` to `1`)

#### Set Signature

> **set** **lowPercentile**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:266](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L266)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:211](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L211)

Gets or sets the maximum EV100 upper bound allowed by auto-exposure. Setting it equal to `minEV100` locks exposure to that EV100. (Default: `16.0`)

##### Returns

`number`

Maximum EV100 value

#### Set Signature

> **set** **maxEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:215](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L215)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:296](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L296)

Gets or sets the maximum exposure amplification multiplier allowed in dark scenes. (Min `1.0`, Default: `64.0`)

##### Returns

`number`

Maximum exposure amplification multiplier

#### Set Signature

> **set** **maxExposureMultiplier**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:300](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L300)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:315](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L315)

Gets or sets the metering mode (`METERING_MODE`) used when measuring screen luminance. (Default: `METERING_MODE.CENTER_WEIGHTED`)

##### Returns

[`METERING_MODE`](../type-aliases/METERING_MODE.md)

Current metering mode

#### Set Signature

> **set** **meteringMode**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:319](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L319)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:194](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L194)

Gets or sets the minimum EV100 lower bound allowed by auto-exposure. Setting it equal to `maxEV100` locks exposure to that EV100. (Default: `-2.0`)

##### Returns

`number`

Minimum EV100 value

#### Set Signature

> **set** **minEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:198](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L198)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:350](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L350)

Returns the pre-exposure multiplier (`preExposure`) calculated from `currentAdaptedEV100` and `exposureCompensation`.

##### Returns

`number`

Pre-exposure multiplier

***

***

### preExposureRatio

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **preExposureRatio**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:362](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L362)

Returns the frame-over-frame pre-exposure change ratio (`preExposureRatio`).

##### Returns

`number`

Frame-over-frame pre-exposure ratio

***

***

### sceneAvgEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sceneAvgEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:386](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L386)

Returns the measured scene average EV100 from histogram analysis.

##### Returns

`number`

Scene average EV100 value

***

***

### targetEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:398](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L398)

Returns the clamped target EV100 after applying target luminance bias.

##### Returns

`number`

Target EV100 value

***

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:175](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L175)

Gets or sets the target average luminance (based on 18% middle gray) toward which auto-exposure converges. (Min `0`, Default: `0.18`)

##### Returns

`number`

Target luminance value

#### Set Signature

> **set** **targetLuminance**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:179](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L179)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useDebugOverlay

#### Get Signature

> **get** **useDebugOverlay**(): `boolean`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:334](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L334)

Gets or sets whether to render the real-time 256-bin histogram and scene/target/adapted EV100 HUD overlay at the bottom-left of the LDR viewport. (Default: `false`)

##### Returns

`boolean`

Whether the debug HUD overlay is enabled

#### Set Signature

> **set** **useDebugOverlay**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:338](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L338)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:435](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L435)

Returns the total video memory usage (in bytes) of the allocated GPU buffers.

##### Returns

`number`

Video memory usage (unit: bytes)

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:661](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L661)

Clears cached source texture bind groups.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:672](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L672)

Releases all allocated GPU buffers and compute/overlay pipeline resources.

#### Returns

`void`

***

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:514](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L514)

Records the 256-bin log-luminance histogram generation and eye adaptation compute passes from the source HDR color texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Post-processing input HDR texture information (`IPostEffectResult`) |

#### Returns

`void`

***

***

### renderDebugOverlay()

> **renderDebugOverlay**(`targetTextureView`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:615](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L615)

Renders the real-time 256-bin histogram and exposure marker HUD overlay onto the post-processed LDR target texture.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetTextureView` | `GPUTextureView` | Post-processed LDR color target texture view (`rgba8unorm`) |

#### Returns

`void`

***

***

### resetAdaptation()

> **resetAdaptation**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:449](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L449)

Schedules an instant zero-latency exposure convergence on the next frame for camera cuts, scene transitions, or teleports.

#### Returns

`void`

***

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:631](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L631)

Asynchronously maps the readback buffer to synchronize the GPU-computed exposure telemetry to CPU getters.

#### Returns

`void`

***

***

### syncPostEffectSystemUniformBuffer()

> **syncPostEffectSystemUniformBuffer**(`postEffectBuffer`, `preExposureByteOffset`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:498](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L498)

Copies the latest `preExposure` and `preExposureRatio` (contiguous 8B) directly on the GPU into the post-effect system uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `postEffectBuffer` | `GPUBuffer` | Post-effect system uniform `GPUBuffer` |
| `preExposureByteOffset` | `number` | Starting byte offset of the `preExposure` member |

#### Returns

`void`

***

***

### syncVertexSystemUniformBuffers()

> **syncVertexSystemUniformBuffers**(`vertexBuffer`, `preExposureByteOffset`, `cascadeBuffers`, `activeCascadeCount`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:471](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L471)

Copies the latest `preExposure` (4B) directly on the GPU from the state buffer into the view's vertex/fragment system uniform buffer and active cascade buffers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | `GPUBuffer` | Main system uniform `GPUBuffer` |
| `preExposureByteOffset` | `number` | Byte offset of the `preExposure` member |
| `cascadeBuffers` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)[] | Shadow cascade system uniform buffer list (`Array<UniformBuffer>`) |
| `activeCascadeCount` | `number` | Number of active cascades |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
