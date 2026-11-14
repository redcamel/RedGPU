[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / DirectionalBlur

# Class: DirectionalBlur

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L12)

Post-processing effect that applies directional blur with a specified angle and strength.

***

### Example
```typescript
const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
effect.angle = 45;
effect.amount = 30;
effect.sampleCount = 40;
view.postEffectManager.addEffect(effect);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/blur/directionalBlur/" />

## See

[DirectionalBlur example](https://redcamel.github.io/RedGPU/examples/postEffect/blur/directionalBlur/)

## Extends

- [`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md)

## Constructors



***

### Constructor

> **new DirectionalBlur**(`redGPUContext`): `DirectionalBlur`

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:62](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L62)

Creates a DirectionalBlur instance.

#### Example
```typescript
const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`DirectionalBlur`

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#constructor)

## Properties



***

### amount

> **amount**: `number` = `15`

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:18](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L18)

Blur strength (0 or greater)

***

***

### sampleCount

> **sampleCount**: `number` = `16`

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L24)

Number of samples (1 ~ 100)

## Accessors



***

### angle

#### Get Signature

> **get** **angle**(): `number` = `0`

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:81](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L81)

Returns or sets the blur angle (unit: degrees, 0 = right, normalized to 360 degrees).

##### Returns

`number`

Blur angle

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:85](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L85)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L19)

Whether the instance is a post-processing effect

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#isinstanceofposteffect)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#antialiasingmanager)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#commandencodermanager)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#gpudevice)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#instanceid)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#isldr)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`name`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#name)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#redgpucontext)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#resourcemanager)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#shaderinfo)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformbuffer)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformsinfo)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:114](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L114)

Returns the video memory usage (in bytes) of the effect's dedicated buffer.

##### Returns

`number`

Video memory usage (unit: bytes)

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#videomemorysize)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_x)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_y)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L197)

Clears cached bind groups and output texture references.

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:207](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L207)

Destroys the effect's uniform buffer and cached resources.

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`destroy`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#destroy)

***

***

### executePass()

> `protected` **executePass**(`view`, `width`, `height`, `result`, ...`sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:339](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L339)

Executes the compute pass into the specified output target (`result`) and returns the result texture information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `result` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | Output texture and view to write the result (`IPostEffectResult`) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)[] | List of input source texture information |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result texture and view (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`executePass`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#executepass)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`init`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#init)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts:111](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/effects/blur/directionalBlur/DirectionalBlur.ts#L111)

Renders the directional blur effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |
| `width` | `number` | Rendering width (in pixels) |
| `height` | `number` | Rendering height (in pixels) |
| `sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md) | Input source texture information |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Result texture information with directional blur applied (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`render`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#render)

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

[`ASingleComputePassPostEffect`](../namespaces/Core/classes/ASingleComputePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASingleComputePassPostEffect.md#updateuniform)

</details>
