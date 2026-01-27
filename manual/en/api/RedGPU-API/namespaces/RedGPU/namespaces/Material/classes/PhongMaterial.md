[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PhongMaterial

# Class: PhongMaterial

Defined in: [src/material/phongMaterial/PhongMaterial.ts:16](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L16)


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

- [`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new PhongMaterial**(`redGPUContext`, `color`, `name?`): `PhongMaterial`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L171)


PhongMaterial constructor

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `color` | `string` | `'#fff'` | Base color (HEX string, default: '#fff') |
| `name?` | `string` | `undefined` | Material name (optional) |

#### Returns

`PhongMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABitmapBaseMaterial.ts#L21)


List of callbacks called when updating the pipeline

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

### alphaTexture

> **alphaTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:46](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L46)


Alpha (transparency) texture

***

### alphaTextureSampler

> **alphaTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L51)


Alpha texture sampler

***

### aoTexture

> **aoTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:86](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L86)


AO (ambient occlusion) texture

***

### aoTextureSampler

> **aoTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:91](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L91)


AO texture sampler

***

### color

> **color**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:21](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L21)


Base color of the material (RGB)

***

### diffuseTexture

> **diffuseTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L56)


Diffuse texture

***

### diffuseTextureSampler

> **diffuseTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L61)


Diffuse texture sampler

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:61](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L61)


Pipeline dirty status flag

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

### emissiveColor

> **emissiveColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:26](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L26)


Emissive color (RGB)

***

### emissiveStrength

> **emissiveStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:31](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L31)


Emissive strength

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:76](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L76)


Emissive texture

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:81](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L81)


Emissive texture sampler

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:56](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L56)


Fragment GPU render info object

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

### metallic

> **metallic**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:111](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L111)


Metallic

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:106](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L106)


Normal map scale

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:96](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L96)


Normal map texture

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:101](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L101)


Normal map texture sampler

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L22)


Material opacity (0~1)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

### roughness

> **roughness**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:116](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L116)


Roughness

***

### specularColor

> **specularColor**: [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:36](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L36)


Specular color (RGB)

***

### specularStrength

> **specularStrength**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:41](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L41)


Specular strength

***

### specularTexture

> **specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L66)


Specular texture

***

### specularTextureSampler

> **specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/phongMaterial/PhongMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L71)


Specular texture sampler

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L27)


Material tint color (RGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:66](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L66)


Whether the material is transparent

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:51](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L51)


Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

### useSSR

> **useSSR**: `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:121](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L121)


Whether to use SSR (Screen Space Reflection)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L32)


Whether to use tint color

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:245](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L245)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:237](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L237)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L65)


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

### displacementScale

#### Get Signature

> **get** **displacementScale**(): `number`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:189](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L189)


Returns displacement scale

##### Returns

`number`

#### Set Signature

> **set** **displacementScale**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:200](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L200)


Sets displacement scale

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

Defined in: [src/material/phongMaterial/PhongMaterial.ts:208](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L208)


Returns displacement texture

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

#### Set Signature

> **set** **displacementTexture**(`value`): `void`

Defined in: [src/material/phongMaterial/PhongMaterial.ts:219](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/phongMaterial/PhongMaterial.ts#L219)


Sets displacement texture and updates pipeline

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

Defined in: [src/material/core/ABaseMaterial.ts:221](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L221)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L217)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:213](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L213)

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L90)


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

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L225)

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:188](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L188)

##### Returns

`string`

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L196)

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

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L229)

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L253)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:264](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L264)


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

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L125)


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

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L152)


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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/resources/core/ResourceBase.ts#L137)


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

Defined in: [src/material/core/ABaseMaterial.ts:414](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L414)


Reflect basic material properties such as uniform/color/tint to the uniform buffer

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:306](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L306)


Update fragment shader bind group/uniform/texture/sampler states

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:383](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L383)


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

Defined in: [src/material/core/ABaseMaterial.ts:436](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L436)


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

Defined in: [src/material/core/ABaseMaterial.ts:272](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABaseMaterial.ts#L272)


Initialize GPU render pipeline info and uniform buffer

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABitmapBaseMaterial.ts#L74)


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

Defined in: [src/material/core/ABitmapBaseMaterial.ts:58](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/material/core/ABitmapBaseMaterial.ts#L58)


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
