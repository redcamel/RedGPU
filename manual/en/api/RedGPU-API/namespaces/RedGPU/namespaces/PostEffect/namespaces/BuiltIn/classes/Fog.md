[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / Fog

# Class: Fog

Defined in: [src/postEffect/builtIn/fog/Fog.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L14)

Distance-based Fog built-in post-processing effect that blends distant objects with fog color in Linear HDR space based on depth information.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Enable Fog and configure distance/density parameters through View3D's builtInEffectManager
view.builtInEffectManager.useFog = true;
const fog = view.builtInEffectManager.fog;
fog.fogType = RedGPU.PostEffect.BuiltIn.Fog.EXPONENTIAL_SQUARED;
fog.density = 0.03;
fog.nearDistance = 5.0;
fog.farDistance = 40.0;
fog.fogColor.setColorByRGB(200, 210, 255);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/fog/fog/" />

## See

[Fog example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/fog/fog/)

## Extends

- [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md)

## Constructors



***

### Constructor

> **new Fog**(`redGPUContext`): `Fog`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:100](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L100)

Creates a Fog instance. (Internal system use only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`Fog`

#### Inherited from

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`constructor`](../../Core/classes/ASingleRenderPassPostEffect.md#constructor)

## Properties



***

### density

> **density**: `number` = `0.03`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:20](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L20)

Fog density (0 ~ 1)

***

***

### farDistance

> **farDistance**: `number` = `50`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:32](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L32)

Fog maximum density distance (0.1 or greater)

***

***

### fogColor

> **fogColor**: [`ColorRGB`](../../../../Color/classes/ColorRGB.md) = `'#c8d2ff'`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:50](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L50)

Fog color object (`ColorRGB`)

***

***

### fogType

> **fogType**: `number` = `0`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L44)

Fog calculation type (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1)

***

***

### maxOpacity

> **maxOpacity**: `number` = `1`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L38)

Maximum opacity cap of fog (0 ~ 1)

***

***

### nearDistance

> **nearDistance**: `number` = `5.0`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:26](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L26)

Fog start distance from camera (0 or greater)

***

***

### EXPONENTIAL

> `static` **EXPONENTIAL**: `number` = `0`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:85](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L85)

Exponential fog type (`0`)

***

***

### EXPONENTIAL\_SQUARED

> `static` **EXPONENTIAL\_SQUARED**: `number` = `1`

Defined in: [src/postEffect/builtIn/fog/Fog.ts:90](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L90)

Exponential Squared fog type (`1`)

## Accessors



## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L22)

Whether the instance is a post-processing effect

#### Inherited from

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md#isinstanceofposteffect)

***

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`antialiasingManager`](../../Core/classes/ASingleRenderPassPostEffect.md#antialiasingmanager)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`blendState`](../../Core/classes/ASingleRenderPassPostEffect.md#blendstate)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`commandEncoderManager`](../../Core/classes/ASingleRenderPassPostEffect.md#commandencodermanager)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`gpuDevice`](../../Core/classes/ASingleRenderPassPostEffect.md#gpudevice)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`instanceId`](../../Core/classes/ASingleRenderPassPostEffect.md#instanceid)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`isLdr`](../../Core/classes/ASingleRenderPassPostEffect.md#isldr)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`name`](../../Core/classes/ASingleRenderPassPostEffect.md#name)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`redGPUContext`](../../Core/classes/ASingleRenderPassPostEffect.md#redgpucontext)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`resourceManager`](../../Core/classes/ASingleRenderPassPostEffect.md#resourcemanager)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`shaderInfo`](../../Core/classes/ASingleRenderPassPostEffect.md#shaderinfo)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`uniformBuffer`](../../Core/classes/ASingleRenderPassPostEffect.md#uniformbuffer)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`uniformsInfo`](../../Core/classes/ASingleRenderPassPostEffect.md#uniformsinfo)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`uuid`](../../Core/classes/ASingleRenderPassPostEffect.md#uuid)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`videoMemorySize`](../../Core/classes/ASingleRenderPassPostEffect.md#videomemorysize)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`clear`](../../Core/classes/ASingleRenderPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASingleRenderPassPostEffect.ts:192](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleRenderPassPostEffect.ts#L192)

Destroys the effect's uniform buffer and cached resources.

#### Returns

`void`

#### Inherited from

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`destroy`](../../Core/classes/ASingleRenderPassPostEffect.md#destroy)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`init`](../../Core/classes/ASingleRenderPassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/fog/Fog.ts:143](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/fog/Fog.ts#L143)

Renders the distance-based fog post-processing effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | Input source texture information |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Rendering result (`IPostEffectResult`)

#### Inherited from

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`render`](../../Core/classes/ASingleRenderPassPostEffect.md#render)

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

[`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md).[`updateUniform`](../../Core/classes/ASingleRenderPassPostEffect.md#updateuniform)

</details>
