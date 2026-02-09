[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / AUVTransformBaseMaterial

# Abstract Class: AUVTransformBaseMaterial

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L24)


Abstract material class providing texture UV transform (Offset, Scale) functionality.


This class provides an API for precisely controlling texture translation (Offset) and tiling (Scale) in bitmap-based materials.


All transform calculations are completed at the vertex shader stage to optimize rendering performance.

### Example
```typescript
// AUVTransformBaseMaterial을 상속받은 머티리얼에서 사용 (In material inheriting from AUVTransformBaseMaterial)
material.textureOffset = [0.1, 0.1];
material.textureScale = [2.0, 2.0];
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/uvTransform/" style="width:100%; height:500px;"></iframe>

## Extends

- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Extended by

- [`PhongMaterial`](../../../classes/PhongMaterial.md)
- [`BitmapMaterial`](../../../classes/BitmapMaterial.md)

## Constructors

### Constructor

> **new AUVTransformBaseMaterial**(`redGPUContext`, `moduleName`, `SHADER_INFO`, `targetGroupIndex`): `AUVTransformBaseMaterial`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:87](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L87)


Creates an AUVTransformBaseMaterial instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `moduleName` | `string` | Material module name |
| `SHADER_INFO` | `any` | Parsed WGSL shader info |
| `targetGroupIndex` | `number` | Bind group index |

#### Returns

`AUVTransformBaseMaterial`

#### Overrides

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`constructor`](ABitmapBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L22)


List of callbacks called when updating the pipeline

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__packingList`](ABitmapBaseMaterial.md#__packinglist)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L62)


Pipeline dirty status flag

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`dirtyPipeline`](ABitmapBaseMaterial.md#dirtypipeline)

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L29)


Texture transform change status flag

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L57)


Fragment GPU render info object

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`gpuRenderInfo`](ABitmapBaseMaterial.md#gpurenderinfo)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L23)


Material opacity (0~1)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`opacity`](ABitmapBaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L28)


Material tint color (RGBA)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`tint`](ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L67)


Whether the material is transparent

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`transparent`](ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L52)


Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`use2PathRender`](ABitmapBaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L33)


Whether to use tint color

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`useTint`](ABitmapBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L289)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`blendAlphaState`](ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L281)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`blendColorState`](ABitmapBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`cacheKey`](ABitmapBaseMaterial.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L257)


Returns the fragment bind group descriptor name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L249)


Returns the fragment shader module name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`gpuDevice`](ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L241)


Returns the material module name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`MODULE_NAME`](ABitmapBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`name`](ABitmapBaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`redGPUContext`](ABitmapBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`resourceManagerKey`](ABitmapBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L265)


Returns the shader storage structure information.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](ABitmapBaseMaterial.md#storage_struct)

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L43)


Texture offset (u, v)

### Example
```typescript
material.textureOffset = [0.5, 0.5];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L47)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L61)


Texture scale (u, v)

### Example
```typescript
material.textureScale = [2.0, 2.0];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:65](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/AUVTransformBaseMaterial.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L205)


Returns the tint blend mode name.

##### Returns

`string`


Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L220)


Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`tintBlendMode`](ABitmapBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L273)


Returns the shader uniforms structure information.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](ABitmapBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`uuid`](ABitmapBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L297)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L308)


Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`writeMaskState`](ABitmapBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__fireListenerList`](ABitmapBaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L463)


Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`_updateBaseProperty`](ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L351)


Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`_updateFragmentState`](ABitmapBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L431)


Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`


GPU fragment state

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`getFragmentRenderState`](ABitmapBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L488)


Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`


GPUSampler instance

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`getGPUResourceSampler`](ABitmapBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABaseMaterial.ts#L316)


Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`initGPURenderInfos`](ABitmapBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L75)


Manages sampler object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Previous sampler |
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | New sampler |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`updateSampler`](ABitmapBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/ABitmapBaseMaterial.ts#L59)


Manages texture object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | Previous texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |
| `texture` | [`ANoiseTexture`](../../../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../../../Resource/classes/HDRTexture.md) | New texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](ABitmapBaseMaterial.md).[`updateTexture`](ABitmapBaseMaterial.md#updatetexture)
