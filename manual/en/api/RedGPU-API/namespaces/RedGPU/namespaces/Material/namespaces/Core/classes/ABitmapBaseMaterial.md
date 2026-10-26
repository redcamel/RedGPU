[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABitmapBaseMaterial

# Abstract Class: ABitmapBaseMaterial

Defined in: [src/material/core/ABitmapBaseMaterial.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L19)

Abstract class providing common functionality for texture and sampler-based materials.

Handles registration and removal of pipeline dirty listeners (DirtyPipelineListener) and updates fragment states when textures or samplers are replaced.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ABaseMaterial`](ABaseMaterial.md)

## Extended by

- [`SkyBoxMaterial`](../../../../Display/namespaces/CoreSkyBox/classes/SkyBoxMaterial.md)
- [`TextFieldMaterial`](../../../../Display/namespaces/CoreTextField/classes/TextFieldMaterial.md)
- [`AUVTransformBaseMaterial`](AUVTransformBaseMaterial.md)
- [`LakeMaterial`](../../../../Water/namespaces/LakeCore/classes/LakeMaterial.md)

## Constructors



***

### Constructor

> `protected` **new ABitmapBaseMaterial**(`redGPUContext`, `moduleName`, `fragmentSource`, `targetGroupIndex`): `ABitmapBaseMaterial`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L43)

Initializes an ABitmapBaseMaterial instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `moduleName` | `string` | Material module name |
| `fragmentSource` | `string` | Fragment shader WGSL source code |
| `targetGroupIndex` | `number` | Bind group target index |

#### Returns

`ABitmapBaseMaterial`

#### Overrides

[`ABaseMaterial`](ABaseMaterial.md).[`constructor`](ABaseMaterial.md#constructor)

## Properties



***

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L24)

List of texture packing callback functions executed when updating fragment state

***

## Accessors



## Methods



***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L80)

Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Previously bound Sampler instance |
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | New Sampler instance to bind |

#### Returns

`void`

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L63)

Updates pipeline dirty listeners upon texture change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | Previously bound texture object |
| `texture` | `any` | New texture object to bind |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L74)

Flag indicating whether the pipeline needs updating

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`dirtyPipeline`](ABaseMaterial.md#dirtypipeline)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L69)

Fragment GPU render pipeline information object

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`gpuRenderInfo`](ABaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L42)

Flag indicating whether it is a material instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`isInstanceofMaterial`](ABaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L27)

Opacity of the material (0.0 to 1.0)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`opacity`](ABaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L32)

Tint color of the material (ColorRGBA)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`tint`](ABaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L79)

Whether transparent rendering is enabled for the material

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`transparent`](ABaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L64)

Whether to use 2-pass rendering

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`use2PathRender`](ABaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L37)

Whether to apply tint color

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`useTint`](ABaseMaterial.md#usetint)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`antialiasingManager`](ABaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L277)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Alpha BlendState instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`blendAlphaState`](ABaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L265)

Returns the color blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Color BlendState instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`blendColorState`](ABaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`cacheKey`](ABaseMaterial.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`commandEncoderManager`](ABaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L217)

Returns the fragment bind group descriptor name.

##### Returns

`string`

Bind group descriptor name

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](ABaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L205)

Returns the fragment shader module name.

##### Returns

`string`

Fragment shader module name

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](ABaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L305)

Returns the allocated slot index within the global fragment SSBO.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`globalFragmentSlotIndex`](ABaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`gpuDevice`](ABaseMaterial.md#gpudevice)

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

[`ABaseMaterial`](ABaseMaterial.md).[`instanceId`](ABaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L193)

Returns the material module name.

##### Returns

`string`

Module name

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`MODULE_NAME`](ABaseMaterial.md#module_name)

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

[`ABaseMaterial`](ABaseMaterial.md).[`name`](ABaseMaterial.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`redGPUContext`](ABaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`resourceManager`](ABaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`resourceManagerKey`](ABaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`revision`](ABaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L241)

Returns the complete parsed WGSL shader information.

##### Returns

`any`

Parsed shader information object

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`SHADER_INFO`](ABaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L229)

Returns the parsed shader storage structure information.

##### Returns

`any`

Storage structure information

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`STORAGE_STRUCT`](ABaseMaterial.md#storage_struct)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L160)

Returns the key name of the currently set tint blend mode or sets a new mode.

##### Throws

Throws an Error if an invalid tint blend mode value or key is specified

##### Returns

`string`

Tint blend mode key string (e.g., `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`tintBlendMode`](ABaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L253)

Returns the parsed shader uniform structure information.

##### Returns

`any`

Uniform structure information

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`UNIFORM_STRUCT`](ABaseMaterial.md#uniform_struct)

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

[`ABaseMaterial`](ABaseMaterial.md).[`uuid`](ABaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L289)

Returns or sets the color write mask (GPUColorWrite) state.

##### Returns

`number`

GPUFlagsConstant value

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`writeMaskState`](ABaseMaterial.md#writemaskstate)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`__addDirtyPipelineListener`](ABaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`__removeDirtyPipelineListener`](ABaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L461)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`_updateBaseProperty`](ABaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L357)

Checks shader variants and updates the fragment bind group and render state.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`_updateFragmentState`](ABaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L510)

Destroys the material instance and releases allocated uniform buffers and global fragment slots.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`destroy`](ABaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L430)

Creates and returns a GPU fragment render state (GPUFragmentState) object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | Fragment shader entry point function name (default: `'main'`) |

#### Returns

`GPUFragmentState`

Configured GPUFragmentState object

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`getFragmentRenderState`](ABaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L502)

Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler instance |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`getGPUResourceSampler`](ABaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L313)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`initGPURenderInfos`](ABaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](ABaseMaterial.md).[`notifyUpdate`](ABaseMaterial.md#notifyupdate)

***

</details>
