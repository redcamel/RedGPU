[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L34)

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

- [`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md)

## Constructors



***

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:54](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L54)

Initializes the `TAA` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`TAA`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`constructor`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#constructor)

## Properties



## Accessors



***

### frameIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:158](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L158)

Returns the accumulated TAA rendering frame index.

##### Returns

`number`

Accumulated frame index

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:146](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L146)

Returns the unjittered projection-view matrix (`mat4`) from the previous frame.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Previous frame's projection-view matrix (`mat4`)

***

***

### sharpness

#### Get Signature

> **get** **sharpness**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L87)

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

Defined in: [src/antialiasing/taa/TAA.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L91)

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

Defined in: [src/antialiasing/taa/TAA.ts:170](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L170)

Returns the total video memory size (in bytes) occupied by the TAA history textures and uniform buffer.

##### Returns

`number`

Total occupied video memory size in bytes

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`videoMemorySize`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#videomemorysize)

***

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:193](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L193)

Clears all allocated ping-pong history textures and cache resources, restoring the initial state.

#### Returns

`void`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`clear`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:213](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L213)

Permanently destroys the TAA instance and all associated GPU resources.

#### Returns

`void`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`destroy`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/antialiasing/taa/TAA.ts:116](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L116)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`render`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#render)

***

***

### reset()

> **reset**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:185](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L185)

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

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L19)

Whether the instance is a post-processing effect

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isInstanceofPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`antialiasingManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`commandEncoderManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#commandencodermanager)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`gpuDevice`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#gpudevice)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`instanceId`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L102)

Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.

##### Returns

`boolean`

Whether the effect operates in LDR space

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isLdr`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#isldr)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`name`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`redGPUContext`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`resourceManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L126)

Returns the WGSL shader parsing information.

##### Returns

`any`

WGSL shader parsing information

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`shaderInfo`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#shaderinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:138](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L138)

Returns the effect-specific uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformBuffer`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:150](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L150)

Returns the effect-specific uniform struct information.

##### Returns

`any`

Uniform struct information

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformsInfo`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformsinfo)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uuid`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uuid)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:163](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L163)

Returns the compute workgroup X-axis size.

##### Returns

`number`

Workgroup X size

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_X`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:176](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L176)

Returns the compute workgroup Y-axis size.

##### Returns

`number`

Workgroup Y size

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Y`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:189](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L189)

Returns the compute workgroup Z-axis size.

##### Returns

`number`

Workgroup Z size

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Z`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### executePass()

> `protected` **executePass**(`view`, `width`, `height`, `result`, ...`sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:339](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L339)

Executes the compute pass into the specified output target (`result`) and returns the result texture information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `result` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Output texture and view to write the result (`IPostEffectResult`) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)[] | List of input source texture information |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result texture and view (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`executePass`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#executepass)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCode`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L236)

Initializes the effect by creating the compute shader module and the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `name` | `string` | Effect identifier name |
| `computeCode` | `string` | Compute shader WGSL code string |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`init`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#init)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:309](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L309)

Writes the value of the specified uniform member to the uniform buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform member key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to write |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`updateUniform`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#updateuniform)

</details>
