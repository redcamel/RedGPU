[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / AUVTransformBaseMaterial

# Abstract Class: AUVTransformBaseMaterial

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L27)

Abstract material class providing texture UV transformation (Offset, Scale) functionality.

Controls texture offset translation and tiling scale in bitmap-based materials, with transformation calculations processed at the vertex shader stage.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Configure UV transform on a material inheriting from AUVTransformBaseMaterial
material.textureOffset = [0.1, 0.1];
material.textureScale = [2.0, 2.0];
```
<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/3d/material/uvTransform/" />

## Extends

- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Extended by

- [`PhongMaterial`](../../../classes/PhongMaterial.md)
- [`BitmapMaterial`](../../../classes/BitmapMaterial.md)
- [`PBRMaterial`](../../../classes/PBRMaterial.md)
- [`LandscapeMaterial`](../../../../Landscape/classes/LandscapeMaterial.md)
- [`OctahedralImpostorMaterial`](../../../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md)

## Constructors



***

### Constructor

> `protected` **new AUVTransformBaseMaterial**(`redGPUContext`, `moduleName`, `fragmentSource`, `targetGroupIndex`): `AUVTransformBaseMaterial`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:54](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L54)

Initializes an AUVTransformBaseMaterial instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `moduleName` | `string` | Material module name |
| `fragmentSource` | `string` | Fragment shader WGSL source code |
| `targetGroupIndex` | `number` | Bind group target index |

#### Returns

`AUVTransformBaseMaterial`

#### Overrides

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`constructor`](ABitmapBaseMaterial.md#constructor)

## Properties



***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L32)

Flag indicating whether texture UV transform information has changed

***

## Accessors



***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L71)

Returns or sets the texture UV offset `[u, v]`.

##### Returns

\[`number`, `number`\]

UV offset tuple `[u, v]` (default: `[0, 0]`)

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

***

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:88](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L88)

Returns or sets the texture UV tiling scale `[u, v]`.

##### Returns

\[`number`, `number`\]

UV scale tuple `[u, v]` (default: `[1, 1]`)

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

***

## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L24)

List of texture packing callback functions executed when updating fragment state

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__packingList`](ABitmapBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L80)

Flag indicating whether the pipeline needs updating

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`dirtyPipeline`](ABitmapBaseMaterial.md#dirtypipeline)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L75)

Fragment GPU render pipeline information object

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`gpuRenderInfo`](ABitmapBaseMaterial.md#gpurenderinfo)

***

***

### isDebuggerMaterial?

> `optional` **isDebuggerMaterial?**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L48)

Flag indicating whether it is a debugger-dedicated material

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`isDebuggerMaterial`](ABitmapBaseMaterial.md#isdebuggermaterial)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L43)

Flag indicating whether it is a material instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`isInstanceofMaterial`](ABitmapBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L28)

Opacity of the material (0.0 to 1.0)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`opacity`](ABitmapBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L33)

Tint color of the material (ColorRGBA)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`tint`](ABitmapBaseMaterial.md#tint)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L70)

Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`use2PathRender`](ABitmapBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L38)

Whether to apply tint color

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`useTint`](ABitmapBaseMaterial.md#usetint)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`antialiasingManager`](ABitmapBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:292](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L292)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Alpha BlendState instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`blendAlphaState`](ABitmapBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L280)

Returns the color blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Color BlendState instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`blendColorState`](ABitmapBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`cacheKey`](ABitmapBaseMaterial.md#cachekey)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`commandEncoderManager`](ABitmapBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L232)

Returns the fragment bind group descriptor name.

##### Returns

`string`

Bind group descriptor name

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L220)

Returns the fragment shader module name.

##### Returns

`string`

Fragment shader module name

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](ABitmapBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:320](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L320)

Returns the allocated slot index within the global fragment SSBO.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`globalFragmentSlotIndex`](ABitmapBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`gpuDevice`](ABitmapBaseMaterial.md#gpudevice)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`instanceId`](ABitmapBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:208](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L208)

Returns the material module name.

##### Returns

`string`

Module name

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`MODULE_NAME`](ABitmapBaseMaterial.md#module_name)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`name`](ABitmapBaseMaterial.md#name)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`redGPUContext`](ABitmapBaseMaterial.md#redgpucontext)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`resourceManager`](ABitmapBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`resourceManagerKey`](ABitmapBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`revision`](ABitmapBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:256](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L256)

Returns the complete parsed WGSL shader information.

##### Returns

`any`

Parsed shader information object

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`SHADER_INFO`](ABitmapBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L244)

Returns the parsed shader storage structure information.

##### Returns

`any`

Storage structure information

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](ABitmapBaseMaterial.md#storage_struct)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:175](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L175)

Returns the key name of the currently set tint blend mode or sets a new mode.

##### Throws

Throws an Error if an invalid tint blend mode value or key is specified

##### Returns

`string`

Tint blend mode key string (e.g., `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:183](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`tintBlendMode`](ABitmapBaseMaterial.md#tintblendmode)

***

***

### transparent

#### Get Signature

> **get** **transparent**(): `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L87)

Gets or sets whether transparent rendering is enabled for the material.

##### Returns

`boolean`

#### Set Signature

> **set** **transparent**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`OctahedralImpostorMaterial`](../../../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md).[`transparent`](../../../../Landscape/namespaces/Foliage/namespaces/Core/classes/OctahedralImpostorMaterial.md#transparent)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:268](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L268)

Returns the parsed shader uniform structure information.

##### Returns

`any`

Uniform structure information

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](ABitmapBaseMaterial.md#uniform_struct)

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

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`uuid`](ABitmapBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:304](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L304)

Returns or sets the color write mask (GPUColorWrite) state.

##### Returns

`number`

GPUFlagsConstant value

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L308)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`writeMaskState`](ABitmapBaseMaterial.md#writemaskstate)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:477](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L477)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`_updateBaseProperty`](ABitmapBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:372](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L372)

Checks shader variants and updates the fragment bind group and render state.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`_updateFragmentState`](ABitmapBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:526](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L526)

Destroys the material instance and releases allocated uniform buffers and global fragment slots.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`destroy`](ABitmapBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:445](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L445)

Creates and returns a GPU fragment render state (GPUFragmentState) object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | Fragment shader entry point function name (default: `'main'`) |

#### Returns

`GPUFragmentState`

Configured GPUFragmentState object

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`getFragmentRenderState`](ABitmapBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:518](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L518)

Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler instance |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`getGPUResourceSampler`](ABitmapBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:328](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L328)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`initGPURenderInfos`](ABitmapBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`notifyUpdate`](ABitmapBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L80)

Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Previously bound Sampler instance |
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | New Sampler instance to bind |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`updateSampler`](ABitmapBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L63)

Updates pipeline dirty listeners upon texture change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | Previously bound texture object |
| `texture` | `any` | New texture object to bind |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`updateTexture`](ABitmapBaseMaterial.md#updatetexture)

</details>
