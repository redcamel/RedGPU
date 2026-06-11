[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / SimplexTexture

# Class: SimplexTexture

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:39](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L39)

**`Experimental`**

Texture class that generates Simplex noise patterns.

Supports 1D, 2D, and 3D Simplex noise, and can create complex patterns through FBM (Fractal Brownian Motion).

* ### Example
```typescript
const texture = new RedGPU.Resource.SimplexTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new SimplexTexture**(`redGPUContext`, `width?`, `height?`, `define`, `useMipmap?`): `SimplexTexture`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L64)

**`Experimental`**

Creates a SimplexTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1024` | Texture width |
| `height` | `number` | `1024` | Texture height |
| `define` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | Noise definition object (optional) |
| `useMipmap` | `boolean` | `true` | Whether to use mipmaps (default: true) |

#### Returns

`SimplexTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### amplitude

#### Get Signature

> **get** **amplitude**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:126](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L126)

**`Experimental`**

Returns the amplitude.

##### Returns

`number`

#### Set Signature

> **set** **amplitude**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:131](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L131)

**`Experimental`**

Sets the amplitude.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:114](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L114)

**`Experimental`**

Returns the frequency.

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:119](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L119)

**`Experimental`**

Sets the frequency.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:162](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L162)

**`Experimental`**

Returns the lacunarity.

##### Returns

`number`

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:167](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L167)

**`Experimental`**

Sets the lacunarity.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### noiseDimension

#### Get Signature

> **get** **noiseDimension**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:99](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L99)

**`Experimental`**

Returns the noise dimension.

##### Returns

`number`

#### Set Signature

> **set** **noiseDimension**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:104](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L104)

**`Experimental`**

Sets the noise dimension.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:138](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L138)

**`Experimental`**

Returns the number of octaves.

##### Returns

`number`

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:143](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L143)

**`Experimental`**

Sets the number of octaves.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:150](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L150)

**`Experimental`**

Returns the persistence.

##### Returns

`number`

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:155](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L155)

**`Experimental`**

Sets the persistence.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:174](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L174)

**`Experimental`**

Returns the seed.

##### Returns

`number`

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:179](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L179)

**`Experimental`**

Sets the seed.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:209](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L209)

**`Experimental`**

Applies noise settings at once.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `settings` | `Partial`\<\{ `amplitude`: `number`; `frequency`: `number`; `lacunarity`: `number`; `octaves`: `number`; `persistence`: `number`; `seed`: `number`; \}\> |

#### Returns

`void`

***

### getSettings()

> **getSettings**(): `object`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:190](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L190)

**`Experimental`**

Returns all current noise settings.

#### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `amplitude` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:192](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L192) |
| `frequency` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:191](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L191) |
| `lacunarity` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:195](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L195) |
| `octaves` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:193](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L193) |
| `persistence` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:194](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L194) |
| `seed` | `number` | [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:196](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L196) |

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/simplex/SimplexTexture.ts:185](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/simplex/SimplexTexture.ts#L185)

**`Experimental`**

Randomizes the seed value.

#### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:41](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L41)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:103](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L103)

**`Experimental`**

Returns the animation speed.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:108](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L108)

**`Experimental`**

Sets the animation speed.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:115](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L115)

**`Experimental`**

Returns the animation X value.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:120](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L120)

**`Experimental`**

Sets the animation X value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:127](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L127)

**`Experimental`**

Returns the animation Y value.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

Sets the animation Y value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L76)

**`Experimental`**

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L53)

**`Experimental`**

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L88)

**`Experimental`**

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L77)

**`Experimental`**

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

Returns the GPUTexture object.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L58)

**`Experimental`**

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L71)

**`Experimental`**

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L40)

**`Experimental`**

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/RedGPUObject.ts#L64)

**`Experimental`**

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:98](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L98)

**`Experimental`**

Resource manager key

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L45)

**`Experimental`**

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:149](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L149)

**`Experimental`**

Returns the current time.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

Sets the current time.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:139](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L139)

**`Experimental`**

Returns the uniform information.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/base/BaseObject.ts#L46)

**`Experimental`**

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:93](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L93)

**`Experimental`**

Video memory usage in bytes

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L101)

**`Experimental`**

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:186](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L186)

**`Experimental`**

Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/ResourceBase.ts#L116)

**`Experimental`**

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:181](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L181)

**`Experimental`**

Renders noise at the specified time.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:161](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L161)

**`Experimental`**

Updates an individual uniform parameter.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:170](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L170)

**`Experimental`**

Updates multiple uniform parameters at once.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)


</details>
