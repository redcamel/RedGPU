[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeMaterial

# Class: LandscapeMaterial

Defined in: [src/landscape/LandscapeMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L21)

Terrain-specific material class that consolidates up to 8 `LandscapeLayer` instances into `2d-array` textures and performs VBT baking and near-detail blending based on a single shared RGBA weight map (`weightTexture`). Automatically created internally when a `Landscape` is instantiated.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Reference material from a Landscape instance and set near-detail distance
const material = landscape.material;
material.nearDetailDistance = 300;
```

## See

[Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)

## Extends

- [`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors



***

### Constructor

> **new LandscapeMaterial**(`redGPUContext`, `baseColorHex?`, `textureArraySize?`): `LandscapeMaterial`

Defined in: [src/landscape/LandscapeMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L92)

Creates a `LandscapeMaterial` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `baseColorHex?` | `string` | `'#387d42'` | Initial base color HEX string (default: `'#387d42'`) |
| `textureArraySize?` | `number` | `1024` | Width/height pixel resolution of the layer `2d-array` textures (minimum: `128`, default: `1024`) |

#### Returns

`LandscapeMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties



***

### baseColor

> **baseColor**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/landscape/LandscapeMaterial.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L26)

Default terrain base color used when no layers are present

***

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/landscape/LandscapeMaterial.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L31)

Default sampler used for terrain layer texture sampling

***

## Accessors



***

### layers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **layers**(): [`LandscapeLayer`](LandscapeLayer.md)[]

Defined in: [src/landscape/LandscapeMaterial.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L127)

Returns the array of `LandscapeLayer` instances registered in the material.

##### Returns

[`LandscapeLayer`](LandscapeLayer.md)[]

Array of `LandscapeLayer` instances

***

***

### nearDetailDistance

#### Get Signature

> **get** **nearDetailDistance**(): `number`

Defined in: [src/landscape/LandscapeMaterial.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L139)

Gets or sets the maximum distance (in world units, minimum: `0`) at which high-resolution near-detail texture blending is maintained.

##### Returns

`number`

Near-detail blending distance

#### Set Signature

> **set** **nearDetailDistance**(`val`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

## Methods



***

### addLayer()

> **addLayer**(`layer`): `this`

Defined in: [src/landscape/LandscapeMaterial.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L251)

Adds a new `LandscapeLayer` to the material and schedules a texture array rebuild. (Maximum 8 layers)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | [`LandscapeLayer`](LandscapeLayer.md) | `LandscapeLayer` instance to add |

#### Returns

`this`

Current `LandscapeMaterial` instance for method chaining

***

***

### clearLayers()

> **clearLayers**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L313)

Removes all registered `LandscapeLayer` instances.

#### Returns

`void`

***

***

### getInternalLayerViews()

> **getInternalLayerViews**(): `object`

Defined in: [src/landscape/LandscapeMaterial.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L169)

Returns the internal layer `2d-array` texture views object (`baseColorView`, `normalView`, `ormView`, `weightMapView`).

#### Returns

`object`

Object containing layer texture array views

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `baseColorView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L170) |
| `normalView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L171) |
| `ormView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L172) |
| `weightMapView` | `GPUTextureView` | [src/landscape/LandscapeMaterial.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L173) |

***

***

### getLayer()

> **getLayer**(`layerName`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/LandscapeMaterial.ts:330](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L330)

Finds and returns the `LandscapeLayer` matching the specified name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layerName` | `string` | Layer name to look up |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

Matching `LandscapeLayer` instance or `undefined`

***

***

### removeLayer()

> **removeLayer**(`layer`): `boolean`

Defined in: [src/landscape/LandscapeMaterial.ts:288](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L288)

Removes the specified `LandscapeLayer` instance or the layer matching the given name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | `string` \| [`LandscapeLayer`](LandscapeLayer.md) | `LandscapeLayer` instance or layer name to remove |

#### Returns

`boolean`

Whether the layer was successfully removed

***

***

### requestVBTRebake()

> **requestVBTRebake**(`immediate?`, `debounceDelayMs?`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L205)

Updates mipmaps of the layer texture arrays and requests a VBT atlas rebake.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `immediate?` | `boolean` | `false` | Whether to execute immediately in a microtask without debounce delay (default: `false`) |
| `debounceDelayMs?` | `number` | `200` | Debounce wait time in milliseconds (default: `200`) |

#### Returns

`void`

***

***

### setOnRebakeVBTRequested()

> **setOnRebakeVBTRequested**(`callback?`): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L190)

Sets the callback function to execute when VBT atlas rebaking is requested.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback?` | () => `void` | Callback function to be invoked when VBT rebaking is requested |

#### Returns

`void`

***

***

### updateUniformsData()

> **updateUniformsData**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:344](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L344)

Packs uniform data of the material and all active layers and uploads it to the fragment uniform GPU buffer.

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L24)

List of texture packing callback functions executed when updating fragment state

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L74)

Flag indicating whether the pipeline needs updating

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L32)

Flag indicating whether texture UV transform information has changed

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../../Material/namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L69)

Fragment GPU render pipeline information object

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L42)

Flag indicating whether it is a material instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isInstanceofMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L27)

Opacity of the material (0.0 to 1.0)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L32)

Tint color of the material (ColorRGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L79)

Whether transparent rendering is enabled for the material

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L64)

Whether to use 2-pass rendering

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L37)

Whether to apply tint color

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`antialiasingManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L277)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

Alpha BlendState instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L265)

Returns the color blend state object.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

Color BlendState instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`commandEncoderManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L217)

Returns the fragment bind group descriptor name.

##### Returns

`string`

Bind group descriptor name

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L205)

Returns the fragment shader module name.

##### Returns

`string`

Fragment shader module name

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L305)

Returns the allocated slot index within the global fragment SSBO.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`globalFragmentSlotIndex`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`instanceId`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L193)

Returns the material module name.

##### Returns

`string`

Module name

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManager`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`revision`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L241)

Returns the complete parsed WGSL shader information.

##### Returns

`any`

Parsed shader information object

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`SHADER_INFO`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L229)

Returns the parsed shader storage structure information.

##### Returns

`any`

Storage structure information

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L71)

Returns or sets the texture UV offset `[u, v]`.

##### Returns

\[`number`, `number`\]

UV offset tuple `[u, v]` (default: `[0, 0]`)

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L88)

Returns or sets the texture UV tiling scale `[u, v]`.

##### Returns

\[`number`, `number`\]

UV scale tuple `[u, v]` (default: `[1, 1]`)

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L160)

Returns the key name of the currently set tint blend mode or sets a new mode.

##### Throws

Throws an Error if an invalid tint blend mode value or key is specified

##### Returns

`string`

Tint blend mode key string (e.g., `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../Material/type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L253)

Returns the parsed shader uniform structure information.

##### Returns

`any`

Uniform structure information

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L289)

Returns or sets the color write mask (GPUColorWrite) state.

##### Returns

`number`

GPUFlagsConstant value

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L461)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:384](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L384)

Updates the fragment render state, uniform buffer, and bind group.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/LandscapeMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeMaterial.ts#L465)

Releases the material's `2d-array` GPU texture resources, timers, and all registered layers.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`destroy`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L430)

Creates and returns a GPU fragment render state (GPUFragmentState) object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | Fragment shader entry point function name (default: `'main'`) |

#### Returns

`GPUFragmentState`

Configured GPUFragmentState object

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L502)

Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler instance |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L313)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`notifyUpdate`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L80)

Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previously bound Sampler instance |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New Sampler instance to bind |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L63)

Updates pipeline dirty listeners upon texture change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | Previously bound texture object |
| `texture` | `any` | New texture object to bind |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../../Material/namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)

***

</details>
