[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / SkyAtmospherePostEffect

# Class: SkyAtmospherePostEffect

Defined in: [src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts:20](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts#L20)

Post-effect class that applies depth-based atmospheric scattered light and transmittance attenuation to scene objects by referencing the Aerial Perspective 3D LUT.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md)

## Constructors



***

### Constructor

> **new SkyAtmospherePostEffect**(`redGPUContext`, `skyAtmosphere`): `SkyAtmospherePostEffect`

Defined in: [src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts#L36)

Creates a SkyAtmospherePostEffect instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `skyAtmosphere` | [`SkyAtmosphere`](../../../classes/SkyAtmosphere.md) | Associated SkyAtmosphere instance |

#### Returns

`SkyAtmospherePostEffect`

#### Overrides

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`constructor`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#constructor)

## Properties



## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts#L126)

Releases the post-effect instance and internal resources.

#### Returns

`void`

#### Overrides

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`destroy`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/skyAtmosphere/core/skyAtmospherePostEffect/SkyAtmospherePostEffect.ts#L112)

Renders the aerial perspective post-effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | Target View3D instance for rendering |
| `width` | `number` | Render target width |
| `height` | `number` | Render target height |
| `sourceTextureInfo` | [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Input source color texture information |

#### Returns

[`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Post-effect render result

#### Overrides

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`render`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#render)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L22)

Whether the instance is a post-processing effect

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`isInstanceofPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`antialiasingManager`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#antialiasingmanager)

***

***

### blendState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendState**(): `GPUBlendState`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L125)

Returns the hardware blend state (`GPUBlendState`) of the render pipeline.

##### Returns

`GPUBlendState`

Hardware blend state

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`blendState`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#blendstate)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`commandEncoderManager`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#commandencodermanager)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`gpuDevice`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#gpudevice)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`instanceId`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:113](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L113)

Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.

##### Returns

`boolean`

Whether the effect operates in LDR space

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`isLdr`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#isldr)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`name`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#name)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`redGPUContext`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#redgpucontext)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`resourceManager`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L149)

Returns the WGSL shader parsing information.

##### Returns

`any`

WGSL shader parsing information

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`shaderInfo`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#shaderinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L161)

Returns the effect-specific uniform buffer.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

`UniformBuffer` instance

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uniformBuffer`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:173](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L173)

Returns the effect-specific uniform struct information.

##### Returns

`any`

Uniform struct information

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uniformsInfo`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#uniformsinfo)

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

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`uuid`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L137)

Returns the video memory usage (in bytes) of the effect's dedicated buffer.

##### Returns

`number`

Video memory usage (unit: bytes)

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`videoMemorySize`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#videomemorysize)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:181](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L181)

Clears cached bind groups and output texture references.

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`clear`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#clear)

***

***

### init()

> **init**(`redGPUContext`, `name`, `shaderCode`): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:220](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L220)

Initializes the effect by creating the render shader module and the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `name` | `string` | Effect identifier name |
| `shaderCode` | `string` | Render shader WGSL code string |

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`init`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#init)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:324](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L324)

Writes the value of the specified uniform member to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform member key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to write |

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md).[`updateUniform`](../../../../PostEffect/namespaces/Core/classes/ASingleRenderPassPostEffect.md#updateuniform)

</details>
