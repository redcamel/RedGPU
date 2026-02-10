[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABaseMaterial

# Abstract Class: ABaseMaterial

Defined in: [src/material/core/ABaseMaterial.ts:18](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L18)


Abstract class serving as a common base for various materials.


It manages core attributes of the render pipeline such as shader information, uniform/texture/sampler structures, and blend states.


It allows consistent control of various rendering attributes such as shader, bind group, blending, color/alpha, tint, and transparency of the GPU pipeline for each material.

## Extends

- [`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md)

## Extended by

- [`ColorMaterial`](../../../classes/ColorMaterial.md)
- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new ABaseMaterial**(`redGPUContext`, `moduleName`, `SHADER_INFO`, `targetGroupIndex`): `ABaseMaterial`

Defined in: [src/material/core/ABaseMaterial.ts:163](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L163)


ABaseMaterial constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `moduleName` | `string` | Material module name |
| `SHADER_INFO` | `any` | Parsed WGSL shader info |
| `targetGroupIndex` | `number` | Bind group index |

#### Returns

`ABaseMaterial`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L62)


Pipeline dirty status flag

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L57)


Fragment GPU render info object

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L23)


Material opacity (0~1)

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L28)


Material tint color (RGBA)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L67)


Whether the material is transparent

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L52)


Whether to use 2-pass rendering

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L33)


Whether to use tint color

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L289)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L281)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L257)


Returns the fragment bind group descriptor name.

##### Returns

`string`

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L249)


Returns the fragment shader module name.

##### Returns

`string`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L241)


Returns the material module name.

##### Returns

`string`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L265)


Returns the shader storage structure information.

##### Returns

`any`

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L205)


Returns the tint blend mode name.

##### Returns

`string`


Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L220)


Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L273)


Returns the shader uniforms structure information.

##### Returns

`any`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L297)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L308)


Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__fireListenerList`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L463)


Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L351)


Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L431)


Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`


GPU fragment state

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L488)


Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`


GPUSampler instance

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/ABaseMaterial.ts#L316)


Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`
