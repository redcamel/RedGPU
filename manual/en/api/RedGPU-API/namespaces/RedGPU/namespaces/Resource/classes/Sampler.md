[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / Sampler

# Class: Sampler

Defined in: [src/resources/sampler/Sampler.ts:33](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L33)

Class that manages GPU texture samplers.

Various options such as sampler's filter, address mode, and anisotropy can be set.
Samplers with the same options are cached internally to prevent redundant creation, and the sampler is automatically updated when options change.

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>

## See

Below is a list of additional sample examples to help understand the structure and operation of Sampler.
 - [Sampler Combination example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerCombination/)
 - [Sampler AddressMode example](https://redcamel.github.io/RedGPU/examples/3d/texture/samplerAddressMode/)

## Extends

- [`ResourceBase`](../namespaces/Core/classes/ResourceBase.md)

## Constructors

### Constructor

> **new Sampler**(`redGPUContext`, `options?`): `Sampler`

Defined in: [src/resources/sampler/Sampler.ts:78](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L78)

Creates a Sampler instance.

* ### Example
```typescript
const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
  magFilter: 'linear',
  minFilter: 'linear',
  addressModeU: 'repeat',
  addressModeV: 'repeat'
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `options?` | `GPUSamplerDescriptor` | GPUSamplerDescriptor options object |

#### Returns

`Sampler`

#### Overrides

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Core/classes/ResourceBase.md#constructor)

## Properties

### addressModeU

#### Get Signature

> **get** **addressModeU**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L88)

Returns the address mode for the U coordinate.

##### Returns

`GPUAddressMode`

- Address mode

#### Set Signature

> **set** **addressModeU**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:97](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L97)

Sets the address mode for the U coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | Address mode to set |

##### Returns

`void`

***

### addressModeV

#### Get Signature

> **get** **addressModeV**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:106](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L106)

Returns the address mode for the V coordinate.

##### Returns

`GPUAddressMode`

- Address mode

#### Set Signature

> **set** **addressModeV**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:115](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L115)

Sets the address mode for the V coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | Address mode to set |

##### Returns

`void`

***

### addressModeW

#### Get Signature

> **get** **addressModeW**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L124)

Returns the address mode for the W coordinate.

##### Returns

`GPUAddressMode`

- Address mode

#### Set Signature

> **set** **addressModeW**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:133](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L133)

Sets the address mode for the W coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUAddressMode` | Address mode to set |

##### Returns

`void`

***

### gpuSampler

#### Get Signature

> **get** **gpuSampler**(): `GPUSampler`

Defined in: [src/resources/sampler/Sampler.ts:160](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L160)

Returns the GPU sampler object.

##### Returns

`GPUSampler`

- WebGPU GPU sampler object

***

### isAnisotropyValid

#### Get Signature

> **get** **isAnisotropyValid**(): `boolean`

Defined in: [src/resources/sampler/Sampler.ts:228](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L228)

Checks if the anisotropy setting is valid. (All filters must be 'linear')

##### Returns

`boolean`

- Whether it is valid

***

### magFilter

#### Get Signature

> **get** **magFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:169](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L169)

Returns the magnification filter mode.

##### Returns

`GPUFilterMode`

- Magnification filter mode

#### Set Signature

> **set** **magFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:178](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L178)

Sets the magnification filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | Magnification filter mode to set |

##### Returns

`void`

***

### maxAnisotropy

#### Get Signature

> **get** **maxAnisotropy**(): `number`

Defined in: [src/resources/sampler/Sampler.ts:205](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L205)

Returns the maximum anisotropy value.

##### Returns

`number`

- Maximum anisotropy value

#### Set Signature

> **set** **maxAnisotropy**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:217](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L217)

Sets the maximum anisotropy value. (Between 1 and 16)

##### Throws

Throws RangeError if value is less than 1 or greater than 16

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Anisotropy value |

##### Returns

`void`

***

### minFilter

#### Get Signature

> **get** **minFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:187](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L187)

Returns the minification filter mode.

##### Returns

`GPUFilterMode`

- Minification filter mode

#### Set Signature

> **set** **minFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L196)

Sets the minification filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | Minification filter mode to set |

##### Returns

`void`

***

### mipmapFilter

#### Get Signature

> **get** **mipmapFilter**(): `GPUMipmapFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:142](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L142)

Returns the mipmap filter mode.

##### Returns

`GPUMipmapFilterMode`

- Mipmap filter mode

#### Set Signature

> **set** **mipmapFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:151](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/sampler/Sampler.ts#L151)

Sets the mipmap filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUMipmapFilterMode` | Mipmap filter mode to set |

##### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`instanceId`](../namespaces/Core/classes/ResourceBase.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L53)

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L61)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Core/classes/ResourceBase.md#revision)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Core/classes/ResourceBase.md#uuid)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L89)

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ResourceBase.md#notifyupdate)


</details>
