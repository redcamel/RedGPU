[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / ANoiseTexture

# Abstract Class: ANoiseTexture

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:37](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L37)

**`Experimental`**


Abstract base class for noise textures.


This class provides functionality to generate noise patterns in real-time using compute shaders.

## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Extended by

- [`SimplexTexture`](../../../classes/SimplexTexture.md)
- [`VoronoiTexture`](../../../classes/VoronoiTexture.md)

## Constructors

### Constructor

> **new ANoiseTexture**(`redGPUContext`, `width`, `height`, `define`): `ANoiseTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:68](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L68)

**`Experimental`**


Creates an ANoiseTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1024` | Texture width |
| `height` | `number` | `1024` | Texture height |
| `define` | `NoiseDefine` | `undefined` | Noise definition object |

#### Returns

`ANoiseTexture`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Properties

### mipLevelCount

> **mipLevelCount**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:38](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L38)

**`Experimental`**

***

### src

> **src**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

***

### useMipmap

> **useMipmap**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:99](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L99)

**`Experimental`**

Returns the animation speed.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:104](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L104)

**`Experimental`**

Sets the animation speed.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:111](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L111)

**`Experimental`**

Returns the animation X value.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

Sets the animation X value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:123](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L123)

**`Experimental`**

Returns the animation Y value.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:128](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L128)

**`Experimental`**

Sets the animation Y value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L57)

**`Experimental`**


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ColorMaterial`](../../../../Material/classes/ColorMaterial.md).[`cacheKey`](../../../../Material/classes/ColorMaterial.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L106)

**`Experimental`**


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:140](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L140)

**`Experimental`**

Returns the GPUTexture object.

##### Returns

`GPUTexture`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L81)

**`Experimental`**


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L90)

**`Experimental`**


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`name`](../../Core/classes/ManagementResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L114)

**`Experimental`**


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:94](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L94)

**`Experimental`**

Resource manager key

##### Returns

`string`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:145](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L145)

**`Experimental`**

Returns the current time.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:150](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L150)

**`Experimental`**

Sets the current time.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:135](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L135)

**`Experimental`**

Returns the uniform information.

##### Returns

`any`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L98)

**`Experimental`**


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:89](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L89)

**`Experimental`**

Video memory usage in bytes

##### Returns

`number`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L125)

**`Experimental`**


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L152)

**`Experimental`**


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../../Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/core/ResourceBase.ts#L137)

**`Experimental`**


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:183](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L183)

**`Experimental`**

Destroys the resource.

#### Returns

`void`

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:177](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L177)

**`Experimental`**

Renders noise at the specified time.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:157](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L157)

**`Experimental`**

Updates an individual uniform parameter.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

Updates multiple uniform parameters at once.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`
