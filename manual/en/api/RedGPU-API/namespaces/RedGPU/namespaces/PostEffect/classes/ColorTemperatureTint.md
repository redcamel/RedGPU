[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / ColorTemperatureTint

# Class: ColorTemperatureTint

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:10](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L10)

Post-processing effect that adjusts the white balance and overall color tone of an image based on Kelvin color temperature and tint.

***

### Example
```typescript
const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
effect.temperature = 3200;
effect.tint = -10;
effect.amount = 0.8;
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/" style="width:100%; height:500px;"></iframe>

## See

[ColorTemperatureTint example](https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/)

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors



***

### Constructor

> **new ColorTemperatureTint**(`redGPUContext`): `ColorTemperatureTint`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L64)

Creates a ColorTemperatureTint instance.

#### Example
```typescript
const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ColorTemperatureTint`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties



***

### amount

> **amount**: `number` = `1`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L16)

Effect application intensity (0 ~ 1)

***

***

### temperature

> **temperature**: `number` = `6500`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L22)

Color temperature value (unit: Kelvin, 1000 ~ 20000)

***

***

### tint

> **tint**: `number` = `0`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L28)

Tint adjustment value (-100 ~ 100)

## Accessors



## Methods



***

### setCandleLight()

> **setCandleLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L108)

Applies the Candle Light preset (1900K, tint -5).

#### Returns

`void`

***

***

### setCloudyDay()

> **setCloudyDay**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L126)

Applies the Cloudy Day preset (7500K, tint 5).

#### Returns

`void`

***

***

### setCoolTone()

> **setCoolTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L90)

Applies the Cool Tone preset (8000K, tint 10).

#### Returns

`void`

***

***

### setDaylight()

> **setDaylight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L117)

Applies the Daylight preset (5600K, tint 0).

#### Returns

`void`

***

***

### setNeonLight()

> **setNeonLight**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:135](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L135)

Applies the Neon Light preset (9000K, tint 15).

#### Returns

`void`

***

***

### setNeutral()

> **setNeutral**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L99)

Applies the Neutral preset (6500K, tint 0).

#### Returns

`void`

***

***

### setWarmTone()

> **setWarmTone**(): `void`

Defined in: [src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/effects/adjustments/colorTemperatureTint/ColorTemperatureTint.ts#L81)

Applies the Warm Tone preset (3200K, tint -10).

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L19)

Whether the instance is a post-processing effect

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L112)

Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.

##### Returns

`boolean`

Whether the effect operates in LDR space

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../namespaces/Core/classes/ASinglePassPostEffect.md#name)

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L235)

Returns the output texture view allocated to the current pass.

##### Returns

`GPUTextureView`

Output `GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L148)

Returns the WGSL shader parsing information corresponding to the current MSAA state.

##### Returns

`any`

WGSL shader parsing information

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L136)

Returns the parsed shader's storage binding structure information.

##### Returns

`any`

Storage binding structure information

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L184)

Returns the system common uniform struct information.

##### Returns

`any`

System uniform struct information

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L160)

Returns the effect-specific uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L172)

Returns the effect-specific uniform struct information.

##### Returns

`any`

Uniform struct information

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L124)

Returns the video memory usage (in bytes) of the effect's dedicated buffer.

##### Returns

`number`

Video memory usage (unit: bytes)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L197)

Returns the compute workgroup X-axis size.

##### Returns

`number`

Workgroup X size

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L210)

Returns the compute workgroup Y-axis size.

##### Returns

`number`

Workgroup Y size

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L223)

Returns the compute workgroup Z-axis size.

##### Returns

`number`

Workgroup Z size

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L243)

Clears cached bind groups and output texture references.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L255)

Destroys the effect's uniform buffer and cached resources.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`destroy`](../namespaces/Core/classes/ASinglePassPostEffect.md#destroy)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L283)

Initializes the effect by creating MSAA/Non-MSAA compute shader modules and the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `name` | `string` | Effect identifier name |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | Compute shader code object for MSAA and Non-MSAA |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L344)

Allocates an output texture from the texture pool, executes the compute pass, and returns the result texture information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)[] | List of input source texture information |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result texture and view (`IPostEffectResult`)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/postEffect/core/ASinglePassPostEffect.ts#L387)

Writes the value of the specified uniform member to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform member key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to write |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)

</details>
