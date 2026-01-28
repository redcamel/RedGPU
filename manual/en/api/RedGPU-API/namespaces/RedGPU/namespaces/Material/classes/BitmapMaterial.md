[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / BitmapMaterial

# Class: BitmapMaterial

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:15](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/bitmapMaterial/BitmapMaterial.ts#L15)


Material class based on bitmap texture.


Various texture-based rendering effects can be implemented through BitmapTexture and Sampler.
* ### Example
```typescript
const sourceTexture = new RedGPU.Resource.BitmapTexture(
   redGPUContext,
   'https://redcamel.github.io/RedGPU/examples/assets/github.png'
);
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, sourceTexture);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/bitmapMaterial/"></iframe>

## Extends

- [`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new BitmapMaterial**(`redGPUContext`, `diffuseTexture?`, `name?`): `BitmapMaterial`

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/bitmapMaterial/BitmapMaterial.ts#L66)


BitmapMaterial constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `diffuseTexture?` | [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) | Bitmap texture to apply |
| `name?` | `string` | Material name (optional) |

#### Returns

`BitmapMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABitmapBaseMaterial.ts#L21)


List of callbacks called when updating the pipeline

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

### diffuseTexture

> **diffuseTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:20](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/bitmapMaterial/BitmapMaterial.ts#L20)


Bitmap texture to apply to the material

***

### diffuseTextureSampler

> **diffuseTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:25](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/bitmapMaterial/BitmapMaterial.ts#L25)


Bitmap texture sampler

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/bitmapMaterial/BitmapMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/bitmapMaterial/BitmapMaterial.ts#L51)


Pipeline dirty status flag

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L56)


Fragment GPU render info object

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L22)


Material opacity (0~1)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L27)


Material tint color (RGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L66)


Whether the material is transparent

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L51)


Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L32)


Whether to use tint color

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:245](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L245)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:237](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L237)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:221](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L221)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L217)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:213](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L213)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`name`](../namespaces/Core/classes/ABitmapBaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L225)

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:188](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L188)

##### Returns

`string`

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L229)

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L253)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:264](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L264)


Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:414](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L414)


Reflect basic material properties such as uniform/color/tint to the uniform buffer

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:306](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L306)


Update fragment shader bind group/uniform/texture/sampler states

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:383](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L383)


Returns GPU fragment render state object

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:436](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L436)


Returns GPU sampler from Sampler object

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:272](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABaseMaterial.ts#L272)


Initialize GPU render pipeline info and uniform buffer

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABitmapBaseMaterial.ts#L74)


Manage sampler object changes and DirtyPipeline listeners

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previous sampler |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New sampler |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:58](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/ABitmapBaseMaterial.ts#L58)


Manage texture object changes and DirtyPipeline listeners

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | Previous texture (BitmapTexture|CubeTexture|ANoiseTexture) |
| `texture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | New texture (BitmapTexture|CubeTexture|ANoiseTexture) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)
