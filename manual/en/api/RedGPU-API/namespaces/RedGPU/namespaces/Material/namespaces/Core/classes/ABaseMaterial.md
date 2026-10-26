[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABaseMaterial

# Abstract Class: ABaseMaterial

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L22)

Abstract class that serves as the common base for all materials.

Manages fragment shader modules, bind group layouts, blend states, and common uniforms (opacity, tint).

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md)

## Extended by

- [`ColorMaterial`](../../../classes/ColorMaterial.md)
- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Constructors



***

### Constructor

> `protected` **new ABaseMaterial**(`redGPUContext`, `moduleName`, `fragmentSource`, `targetGroupIndex`): `ABaseMaterial`

Defined in: [src/material/core/ABaseMaterial.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L117)

Initializes an ABaseMaterial instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `moduleName` | `string` | Unique name of the material module |
| `fragmentSource` | `string` | Fragment shader WGSL source code |
| `targetGroupIndex` | `number` | Bind group target index |

#### Returns

`ABaseMaterial`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties



***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L74)

Flag indicating whether the pipeline needs updating

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L69)

Fragment GPU render pipeline information object

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L42)

Flag indicating whether it is a material instance

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L27)

Opacity of the material (0.0 to 1.0)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L32)

Tint color of the material (ColorRGBA)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L79)

Whether transparent rendering is enabled for the material

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L64)

Whether to use 2-pass rendering

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L37)

Whether to apply tint color

## Accessors



***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L277)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Alpha BlendState instance

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

## Methods



***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L461)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L357)

Checks shader variants and updates the fragment bind group and render state.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L510)

Destroys the material instance and releases allocated uniform buffers and global fragment slots.

#### Returns

`void`

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

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L313)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`instanceId`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#instanceid)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#name)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#revision)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)

</details>
