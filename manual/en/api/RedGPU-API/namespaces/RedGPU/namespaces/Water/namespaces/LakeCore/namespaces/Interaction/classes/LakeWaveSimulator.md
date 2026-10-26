[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeWaveSimulator

# Class: LakeWaveSimulator

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L19)

Class that simulates lake surface wave propagation and generates a ripple normal texture.

Automatically created internally when a `Lake` instance is constructed.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new LakeWaveSimulator**(`redGPUContext`, `textureSize?`): `LakeWaveSimulator`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L80)

Creates a `LakeWaveSimulator` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `textureSize?` | `number` | `512` | Simulation texture resolution (default: `512`) |

#### Returns

`LakeWaveSimulator`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### damping

> **damping**: `number` = `0.012`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L46)

Wave energy damping factor per frame. (Default: `0.012`)

***

***

### normalStrength

> **normalStrength**: `number` = `1.0`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L51)

Strength of the generated ripple normal. (Default: `1.0`)

***

***

### rippleNormalTexture

> **rippleNormalTexture**: `GPUTexture`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L30)

`GPUTexture` storing the simulated ripple normals.

***

***

### rippleNormalTextureView

> **rippleNormalTextureView**: `GPUTextureView`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L35)

`GPUTextureView` of `rippleNormalTexture`.

***

***

### textureSize

> **textureSize**: `number` = `512`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L24)

Width and height resolution of the wave simulation texture in pixels. (Default: `512`)

***

***

### waveSpeed

> **waveSpeed**: `number` = `0.32`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L41)

Wave propagation speed. (Default: `0.32`)

## Accessors



## Methods



***

### clear()

> **clear**(`commandEncoder`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:175](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L175)

Clears the wave buffers and ripple normal texture to zero.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | `GPUCommandEncoder` to record the clear pass |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:185](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L185)

Releases all allocated GPU resources.

#### Returns

`void`

***

***

### simulate()

> **simulate**(`commandEncoder`, `shiftX?`, `shiftZ?`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L140)

Executes the wave simulation compute pass.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | `undefined` | `GPUCommandEncoder` to record the compute pass |
| `shiftX?` | `number` | `0` | X-axis texel offset from domain movement (default: `0`) |
| `shiftZ?` | `number` | `0` | Z-axis texel offset from domain movement (default: `0`) |

#### Returns

`void`

***

***

### updateCaptureBinding()

> **updateCaptureBinding**(`captureTextureView`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:97](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L97)

Binds the penetration depth texture view from the capture pass to the bind groups.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `captureTextureView` | `GPUTextureView` | `GPUTextureView` from the capture pass |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
