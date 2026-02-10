[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PhongMaterial

# Class: PhongMaterial

Defined in: [src/material/phongMaterial/PhongMaterial.ts:16](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L16)


Material class supporting various textures/parameters based on Phong lighting.


Realistic lighting effects can be implemented through various textures, samplers, and parameters such as diffuse, specular, normal, AO, alpha, and emissive.
* ### Example
```typescript
const sourceTexture = new RedGPU.Resource.BitmapTexture(
   redGPUContext,
   'https://redcamel.github.io/RedGPU/examples/assets/github.png'
);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = sourceTexture;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/material/phongMaterial/"></iframe>

## See

[PhongMaterial Texture Combination example](https://redcamel.github.io/RedGPU/examples/3d/material/phongMaterialTextures/)

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors

### Constructor

> **new PhongMaterial**(`redGPUContext`, `color?`, `name?`): `PhongMaterial`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L171)


PhongMaterial constructor

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `color` | `string` | `'#fff'` | Base color (HEX string, default: '#fff') |
| `name?` | `string` | `undefined` | Material name (optional) |

#### Returns

`PhongMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L22)


List of callbacks called when updating the pipeline

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

### alphaTexture

> **alphaTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:46](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L46)


Alpha (transparency) texture

***

### alphaTextureSampler

> **alphaTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L51)


Alpha texture sampler

***

### aoTexture

> **aoTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:86](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L86)


AO (ambient occlusion) texture

***

### aoTextureSampler

> **aoTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:91](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L91)


AO texture sampler

***

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L21)


Base color of the material (RGB)

***

### diffuseTexture

> **diffuseTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L56)


Diffuse texture

***

### diffuseTextureSampler

> **diffuseTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L61)


Diffuse texture sampler

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L62)


Pipeline dirty status flag

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/AUVTransformBaseMaterial.ts#L29)


Texture transform change status flag

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

### emissiveColor

> **emissiveColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:26](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L26)


Emissive color (RGB)

***

### emissiveStrength

> **emissiveStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:31](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L31)


Emissive strength

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:76](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L76)


Emissive texture

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L81)


Emissive texture sampler

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L57)


Fragment GPU render info object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

### metallic

> **metallic**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:111](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L111)


Metallic

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:106](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L106)


Normal map scale

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:96](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L96)


Normal map texture

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:101](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L101)


Normal map texture sampler

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L23)


Material opacity (0~1)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

### roughness

> **roughness**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:116](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L116)


Roughness

***

### specularColor

> **specularColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:36](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L36)


Specular color (RGB)

***

### specularStrength

> **specularStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:41](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L41)


Specular strength

***

### specularTexture

> **specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L66)


Specular texture

***

### specularTextureSampler

> **specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L71)


Specular texture sampler

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L28)


Material tint color (RGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L67)


Whether the material is transparent

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:52](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L52)


Whether to use 2-pass rendering

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

### useSSR

> **useSSR**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:121](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L121)


Whether to use SSR (Screen Space Reflection)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L33)


Whether to use tint color

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L289)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L281)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

### displacementScale

#### Get Signature

> **get** **displacementScale**(): `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:192](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L192)


Returns the displacement scale.

##### Returns

`number`


Scale value

#### Set Signature

> **set** **displacementScale**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:203](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L203)


Sets the displacement scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

***

### displacementTexture

#### Get Signature

> **get** **displacementTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:214](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L214)


Returns the displacement texture.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)


BitmapTexture

#### Set Signature

> **set** **displacementTexture**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/phongMaterial/PhongMaterial.ts#L225)


Sets the displacement texture and updates the pipeline.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) | BitmapTexture |

##### Returns

`void`

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L257)


Returns the fragment bind group descriptor name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L249)


Returns the fragment shader module name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L241)


Returns the material module name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L265)


Returns the shader storage structure information.

##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/AUVTransformBaseMaterial.ts#L43)


Texture offset (u, v)

### Example
```typescript
material.textureOffset = [0.5, 0.5];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:47](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/AUVTransformBaseMaterial.ts#L47)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/AUVTransformBaseMaterial.ts#L61)


Texture scale (u, v)

### Example
```typescript
material.textureScale = [2.0, 2.0];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/AUVTransformBaseMaterial.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L205)


Returns the tint blend mode name.

##### Returns

`string`


Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L220)


Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L273)


Returns the shader uniforms structure information.

##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L297)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L308)


Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L463)


Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L351)


Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L431)


Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`


GPU fragment state

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L488)


Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`


GPUSampler instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L316)


Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L75)


Manages sampler object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previous sampler |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New sampler |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L59)


Manages texture object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | Previous texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |
| `texture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | New texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)
