[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / BrightnessContrast

# Class: BrightnessContrast

Defined in: [src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts:9](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts#L9)

Brightness/Contrast adjustment post-processing effect.

Finely adjusts the overall brightness and the difference between colors (Contrast) of the image.

This effect operates in LDR space, providing the most accurate correction results based on the standard 0-1 color range.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
effect.brightness = 50;  // 밝기 증가
effect.contrast = 20;    // 대비 증가
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/adjustments/brightnessContrast/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new BrightnessContrast**(`redGPUContext`): `BrightnessContrast`

Defined in: [src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts#L44)

Creates a BrightnessContrast instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`BrightnessContrast`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### brightness

> **brightness**: `number`

Defined in: [src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts:11](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts#L11)

Brightness adjustment value (-150 ~ 150)

***

### contrast

> **contrast**: `number`

Defined in: [src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts:13](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/effects/adjustments/brightnessContrast/BrightnessContrast.ts#L13)

Contrast adjustment value (-50 ~ 100)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

***

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:13](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L13)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

### isLdr

> **isLdr**: `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:30](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L30)

Whether the effect operates in LDR (Low Dynamic Range) space

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../namespaces/Core/classes/ASinglePassPostEffect.md#name)

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:208](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L208)

Returns the currently allocated output texture view.

##### Returns

`GPUTextureView`

Output GPUTextureView

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L124)

Returns shader information based on the current MSAA state.

##### Returns

`any`

WGSL shader analysis info

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L112)

Returns storage info from the shader.

##### Returns

`any`

Storage structure information

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUniformsInfo

#### Get Signature

> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L160)

Returns the system common globalStruct struct information.

##### Returns

`any`

System globalStruct structure info

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L136)

Returns the effect-specific globalStruct buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Uniform buffer instance

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L148)

Returns the effect-specific globalStruct struct information.

##### Returns

`any`

Uniform structure info

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:99](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L99)

Returns the video memory usage in bytes.

##### Returns

`number`

Video memory usage in bytes

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L172)

Returns the workgroup size X.

##### Returns

`number`

Workgroup size X

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L184)

Returns the workgroup size Y.

##### Returns

`number`

Workgroup size Y

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L196)

Returns the workgroup size Z.

##### Returns

`number`

Workgroup size Z

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:216](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L216)

Clears the resources used by the effect.

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:238](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L238)

Initializes the effect. Creates compute shaders and globalStruct buffers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |
| `name` | `string` | Effect name |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | Compute shader source codes for MSAA and Non-MSAA |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:296](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L296)

Renders the effect and returns the result. Updates bind groups if necessary.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Rendering width |
| `height` | `number` | Rendering height |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)[] | List of source texture information to be used as input |

#### Returns

[`IPostEffectResult`](../namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result (texture and view)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:349](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/ASinglePassPostEffect.ts#L349)

Updates a specific globalStruct value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform key name |
| `value` | `number` \| `boolean` \| `number`[] | Value to set |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)


</details>
