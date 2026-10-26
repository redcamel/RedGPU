[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / ASinglePassPostEffect

# Abstract Class: ASinglePassPostEffect

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:13](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L13)

Abstract base class for post-processing effects that execute in a single compute pass.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`BrightnessContrast`](../../../classes/BrightnessContrast.md)
- [`ColorBalance`](../../../classes/ColorBalance.md)
- [`ColorTemperatureTint`](../../../classes/ColorTemperatureTint.md)
- [`Grayscale`](../../../classes/Grayscale.md)
- [`HueSaturation`](../../../classes/HueSaturation.md)
- [`Invert`](../../../classes/Invert.md)
- [`Threshold`](../../../classes/Threshold.md)
- [`Vibrance`](../../../classes/Vibrance.md)
- [`BlurX`](../../../classes/BlurX.md)
- [`BlurY`](../../../classes/BlurY.md)
- [`DirectionalBlur`](../../../classes/DirectionalBlur.md)
- [`RadialBlur`](../../../classes/RadialBlur.md)
- [`ZoomBlur`](../../../classes/ZoomBlur.md)
- [`ChromaticAberration`](../../../classes/ChromaticAberration.md)
- [`LensDistortion`](../../../classes/LensDistortion.md)
- [`Vignetting`](../../../classes/Vignetting.md)
- [`Fog`](../../../classes/Fog.md)
- [`HeightFog`](../../../classes/HeightFog.md)
- [`FilmGrain`](../../../classes/FilmGrain.md)
- [`Convolution`](../../../classes/Convolution.md)
- [`FXAA`](../../../../Antialiasing/classes/FXAA.md)
- [`TAA`](../../../../Antialiasing/classes/TAA.md)
- [`SkyAtmospherePostEffect`](../../../../Display/namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)
- [`AMultiPassPostEffect`](AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> `protected` **new ASinglePassPostEffect**(`redGPUContext`, `options?`): `ASinglePassPostEffect`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L84)

Creates an ASinglePassPostEffect instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `options?` | \{ `isLdr?`: `boolean`; `workSizeX?`: `number`; `workSizeY?`: `number`; `workSizeZ?`: `number`; \} | Initialization options (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`) |
| `options.isLdr?` | `boolean` | - |
| `options.workSizeX?` | `number` | - |
| `options.workSizeY?` | `number` | - |
| `options.workSizeZ?` | `number` | - |

#### Returns

`ASinglePassPostEffect`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L19)

Whether the instance is a post-processing effect

## Accessors



***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L112)

Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.

##### Returns

`boolean`

Whether the effect operates in LDR space

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L235)

Returns the output texture view allocated to the current pass.

##### Returns

`GPUTextureView`

Output `GPUTextureView`

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L148)

Returns the WGSL shader parsing information corresponding to the current MSAA state.

##### Returns

`any`

WGSL shader parsing information

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L136)

Returns the parsed shader's storage binding structure information.

##### Returns

`any`

Storage binding structure information

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L184)

Returns the system common uniform struct information.

##### Returns

`any`

System uniform struct information

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L160)

Returns the effect-specific uniform buffer.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

`UniformBuffer` instance

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L172)

Returns the effect-specific uniform struct information.

##### Returns

`any`

Uniform struct information

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L124)

Returns the video memory usage (in bytes) of the effect's dedicated buffer.

##### Returns

`number`

Video memory usage (unit: bytes)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L197)

Returns the compute workgroup X-axis size.

##### Returns

`number`

Workgroup X size

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L210)

Returns the compute workgroup Y-axis size.

##### Returns

`number`

Workgroup Y size

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L223)

Returns the compute workgroup Z-axis size.

##### Returns

`number`

Workgroup Z size

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L243)

Clears cached bind groups and output texture references.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L255)

Destroys the effect's uniform buffer and cached resources.

#### Returns

`void`

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L283)

Initializes the effect by creating MSAA/Non-MSAA compute shader modules and the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `name` | `string` | Effect identifier name |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | Compute shader code object for MSAA and Non-MSAA |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

***

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:344](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L344)

Allocates an output texture from the texture pool, executes the compute pass, and returns the result texture information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../interfaces/IPostEffectResult.md)[] | List of input source texture information |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Rendering result texture and view (`IPostEffectResult`)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L387)

Writes the value of the specified uniform member to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform member key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to write |

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

***

</details>
