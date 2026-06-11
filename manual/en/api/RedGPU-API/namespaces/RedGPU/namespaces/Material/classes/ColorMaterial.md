[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / ColorMaterial

# Class: ColorMaterial

Defined in: [src/material/colorMaterial/ColorMaterial.ts:11](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/colorMaterial/ColorMaterial.ts#L11)

Material class for solid color rendering.

It allows color specification based on ColorRGB and is used when rendering objects with a single color in the GPU pipeline.
* ### Example
```typescript
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/colorMaterial/"></iframe>

## Extends

- [`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md)

## Constructors

### Constructor

> **new ColorMaterial**(`redGPUContext`, `color?`): `ColorMaterial`

Defined in: [src/material/colorMaterial/ColorMaterial.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/colorMaterial/ColorMaterial.ts#L45)

ColorMaterial constructor

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `color` | `string` | `'#fff'` | HEX string or color code (default: '#fff') |

#### Returns

`ColorMaterial`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABaseMaterial.md#constructor)

## Properties

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/colorMaterial/ColorMaterial.ts:16](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/colorMaterial/ColorMaterial.ts#L16)

Monochromatic color of material (ColorRGB)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L67)

Pipeline dirty status flag

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABaseMaterial.md#dirtypipeline)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L62)

Fragment GPU render info object

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABaseMaterial.md#gpurenderinfo)

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L33)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`isInstanceofMaterial`](../namespaces/Core/classes/ABaseMaterial.md#isinstanceofmaterial)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L22)

Material opacity (0~1)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L27)

Material tint color (RGBA)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tint`](../namespaces/Core/classes/ABaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:72](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L72)

Whether the material is transparent

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L57)

Whether to use 2-pass rendering

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L32)

Whether to use tint color

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABaseMaterial.md#usetint)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`antialiasingManager`](../namespaces/Core/classes/ABaseMaterial.md#antialiasingmanager)

***

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:291](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L291)

Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:283](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L283)

Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L53)

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L61)

Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/ABaseMaterial.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`commandEncoderManager`](../namespaces/Core/classes/ABaseMaterial.md#commandencodermanager)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:259](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L259)

Returns the fragment bind group descriptor name.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:251](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L251)

Returns the fragment shader module name.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:243](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L243)

Returns the material module name.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`name`](../namespaces/Core/classes/ABaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABaseMaterial.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`resourceManager`](../namespaces/Core/classes/ABaseMaterial.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABaseMaterial.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`revision`](../namespaces/Core/classes/ABaseMaterial.md#revision)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:267](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L267)

Returns the shader storage structure information.

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:207](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L207)

Returns the tint blend mode name.

##### Returns

`string`

Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:222](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L222)

Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:275](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L275)

Returns the shader uniforms structure information.

##### Returns

`any`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:299](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L299)

Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:310](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L310)

Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/ABaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L89)

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ABaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ABaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L465)

Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:353](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L353)

Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:433](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L433)

Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`

GPU fragment state

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L490)

Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:318](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/material/core/ABaseMaterial.ts#L318)

Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABaseMaterial.md#initgpurenderinfos)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABaseMaterial`](../namespaces/Core/classes/ABaseMaterial.md).[`notifyUpdate`](../namespaces/Core/classes/ABaseMaterial.md#notifyupdate)


</details>
