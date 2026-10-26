[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L34)

TAA (Temporal Anti-Aliasing) class that delivers high-quality anti-aliasing by combining previous frame history with pixel motion vectors.

Smooths out not only jagged object edges, but also flickering specular highlights and broken thin lines, while preserving image sharpness through built-in Contrast Adaptive Sharpening (CAS).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable TAA and configure per-view TAA sharpening strength
redGPUContext.antialiasingManager.useTAA = true;
view.taa.sharpness = 0.5;
```

## Extends

- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors



***

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L74)

Initializes the `TAA` instance and its internal `TAACASPass`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`TAA`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties



## Accessors



***

### casPass

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casPass**(): `TAACASPass`

Defined in: [src/antialiasing/taa/TAA.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L159)

Returns the built-in `TAACASPass` instance that compensates for TAA temporal blending blur.

##### Returns

`TAACASPass`

Built-in `TAACASPass` instance

***

***

### frameIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L183)

Returns the accumulated TAA rendering frame index.

##### Returns

`number`

Accumulated frame index

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:171](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L171)

Returns the unjittered projection-view matrix (`mat4`) from the previous frame.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Previous frame's projection-view matrix (`mat4`)

***

***

### sharpness

#### Get Signature

> **get** **sharpness**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L62)

Gets or sets the sharpening strength of the post-TAA CAS (Contrast Adaptive Sharpening) pass. Valid range is `0.0` to `1.0`, and the default value is `0.5`.

#### Example
```typescript
// Adjust TAA sharpening strength
view.taa.sharpness = 0.6;
```

##### Returns

`number`

CAS sharpening strength (`0.0` to `1.0`)

#### Set Signature

> **set** **sharpness**(`value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:195](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L195)

Returns the total video memory size (in bytes) occupied by the TAA history textures, uniform buffer, and CAS pass.

##### Returns

`number`

Total occupied video memory size in bytes

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L218)

Clears all allocated ping-pong history textures and CAS pass cache resources, restoring the initial state.

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L241)

Permanently destroys the TAA instance, internal CAS pass, and all associated GPU resources.

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`destroy`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/antialiasing/taa/TAA.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L117)

Renders the TAA pass by combining the current frame's source texture with the previous frame's history.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance for rendering |
| `width` | `number` | Render target width in pixels |
| `height` | `number` | Render target height in pixels |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Input source texture and view information |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Output texture result (`IPostEffectResult`) with TAA applied

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

***

### reset()

> **reset**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/antialiasing/taa/TAA.ts#L210)

Resets the accumulated frame index to `0` so that the next frame starts fresh convergence without blending previous history.

#### Example
```typescript
// Reset accumulated TAA history
view.taa.reset();
```

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#name)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#init)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)

</details>
