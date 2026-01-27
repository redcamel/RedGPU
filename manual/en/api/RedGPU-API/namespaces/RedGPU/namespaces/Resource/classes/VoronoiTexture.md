[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:59](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L59)

**`Experimental`**


Texture class that generates Voronoi noise patterns.


Can generate cellular patterns, stone textures, crack patterns, cell ID outputs, etc.

* ### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width`, `height`, `define?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:89](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L89)

**`Experimental`**


Creates a VoronoiTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1024` | Texture width |
| `height` | `number` | `1024` | Texture height |
| `define?` | `NoiseDefine` | `undefined` | Noise definition object (optional) |

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### mipLevelCount

> **mipLevelCount**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:38](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L38)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:99](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L99)

**`Experimental`**

Returns the animation speed.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:104](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L104)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:111](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L111)

**`Experimental`**

Returns the animation X value.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:123](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L123)

**`Experimental`**

Returns the animation Y value.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:128](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L128)

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

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L57)

**`Experimental`**


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L65)

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

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:242](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L242)

**`Experimental`**

Returns the cell ID color intensity.

##### Returns

`number`

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:247](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L247)

**`Experimental`**

Sets the cell ID color intensity.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:141](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L141)

**`Experimental`**

Returns the distance scale.

##### Returns

`number`

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:146](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L146)

**`Experimental`**

Sets the distance scale.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:200](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L200)

**`Experimental`**

Returns the distance type.

##### Returns

`number`

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:205](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L205)

**`Experimental`**

Sets the distance type.

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:129](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L129)

**`Experimental`**

Returns the frequency.

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:134](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L134)

**`Experimental`**

Sets the frequency.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L106)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:140](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L140)

**`Experimental`**

Returns the GPUTexture object.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:230](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L230)

**`Experimental`**

Returns the jitter value.

##### Returns

`number`

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:235](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L235)

**`Experimental`**

Sets the jitter value.

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:177](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L177)

**`Experimental`**

Returns the lacunarity.

##### Returns

`number`

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:182](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L182)

**`Experimental`**

Sets the lacunarity.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L81)

**`Experimental`**


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L90)

**`Experimental`**


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:153](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L153)

**`Experimental`**

Returns the number of octaves.

##### Returns

`number`

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:158](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L158)

**`Experimental`**

Sets the number of octaves.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:215](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L215)

**`Experimental`**

Returns the output type.

##### Returns

`number`

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:220](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L220)

**`Experimental`**

Sets the output type.

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

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:165](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L165)

**`Experimental`**

Returns the persistence.

##### Returns

`number`

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:170](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L170)

**`Experimental`**

Sets the persistence.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L114)

**`Experimental`**


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:94](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L94)

**`Experimental`**

Resource manager key

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:189](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L189)

**`Experimental`**

Returns the seed.

##### Returns

`number`

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:194](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L194)

**`Experimental`**

Sets the seed.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ManagementResourceBase.ts#L45)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:145](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L145)

**`Experimental`**

Returns the current time.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:150](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L150)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:135](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L135)

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

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L98)

**`Experimental`**


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:89](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L89)

**`Experimental`**

Video memory usage in bytes

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L125)

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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L152)

**`Experimental`**


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__fireListenerList`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L137)

**`Experimental`**


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:377](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L377)

**`Experimental`**

Applies settings at once.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `settings` | `Partial`\<`VoronoiSettings`\> |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:183](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L183)

**`Experimental`**

Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:391](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L391)

**`Experimental`**

Returns the name of current distance type.

#### Returns

`string`

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:401](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L401)

**`Experimental`**

Returns the name of current output type.

#### Returns

`string`

***

### getSettings()

> **getSettings**(): `VoronoiSettings`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:361](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L361)

**`Experimental`**

Returns current settings.

#### Returns

`VoronoiSettings`

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:254](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L254)

**`Experimental`**

Randomizes the seed.

#### Returns

`void`

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:177](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L177)

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

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:353](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L353)

**`Experimental`**

Applies the biome map pattern preset.

#### Returns

`void`

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:299](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L299)

**`Experimental`**

Sets the cell ID color output method.

#### Returns

`void`

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:294](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L294)

**`Experimental`**

Sets the cell ID output method.

#### Returns

`void`

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:304](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L304)

**`Experimental`**

Applies the cellular pattern preset.

#### Returns

`void`

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:269](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L269)

**`Experimental`**

Sets the Chebyshev distance method.

#### Returns

`void`

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:284](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L284)

**`Experimental`**

Sets the crack pattern method.

#### Returns

`void`

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:330](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L330)

**`Experimental`**

Applies the crystal pattern preset.

#### Returns

`void`

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:259](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L259)

**`Experimental`**

Sets the Euclidean distance method.

#### Returns

`void`

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:274](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L274)

**`Experimental`**

Sets the F1 output method.

#### Returns

`void`

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:279](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L279)

**`Experimental`**

Sets the F2 output method.

#### Returns

`void`

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:324](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L324)

**`Experimental`**

Applies the grid pattern preset.

#### Returns

`void`

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:264](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L264)

**`Experimental`**

Sets the Manhattan distance method.

#### Returns

`void`

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:345](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L345)

**`Experimental`**

Applies the mosaic pattern preset.

#### Returns

`void`

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:318](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L318)

**`Experimental`**

Applies the organic pattern preset.

#### Returns

`void`

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:289](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L289)

**`Experimental`**

Sets the smooth blend method.

#### Returns

`void`

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:337](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L337)

**`Experimental`**

Applies the stained glass pattern preset.

#### Returns

`void`

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:311](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L311)

**`Experimental`**

Applies the stone pattern preset.

#### Returns

`void`

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:157](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L157)

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

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

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
