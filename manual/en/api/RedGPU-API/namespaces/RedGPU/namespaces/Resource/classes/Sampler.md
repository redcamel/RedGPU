[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / Sampler

# Class: Sampler

Defined in: [src/resources/sampler/Sampler.ts:33](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L33)


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

Defined in: [src/resources/sampler/Sampler.ts:78](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L78)


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

## Accessors

### addressModeU

#### Get Signature

> **get** **addressModeU**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:84](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L84)

Address mode for U coordinate

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeU**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:89](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L89)

Sets the address mode for U coordinate

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### addressModeV

#### Get Signature

> **get** **addressModeV**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:94](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L94)

Address mode for V coordinate

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeV**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:99](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L99)

Sets the address mode for V coordinate

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### addressModeW

#### Get Signature

> **get** **addressModeW**(): `GPUAddressMode`

Defined in: [src/resources/sampler/Sampler.ts:104](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L104)

Address mode for W coordinate

##### Returns

`GPUAddressMode`

#### Set Signature

> **set** **addressModeW**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:109](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L109)

Sets the address mode for W coordinate

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUAddressMode` |

##### Returns

`void`

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ColorMaterial`](../../Material/classes/ColorMaterial.md).[`cacheKey`](../../Material/classes/ColorMaterial.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### gpuSampler

#### Get Signature

> **get** **gpuSampler**(): `GPUSampler`

Defined in: [src/resources/sampler/Sampler.ts:136](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L136)


Returns the GPU sampler object.

##### Returns

`GPUSampler`

***

### isAnisotropyValid

#### Get Signature

> **get** **isAnisotropyValid**(): `boolean`

Defined in: [src/resources/sampler/Sampler.ts:206](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L206)


Checks if the anisotropy setting is valid. (All filters must be 'linear')

##### Returns

`boolean`

***

### magFilter

#### Get Signature

> **get** **magFilter**(): `GPUFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:144](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L144)


Returns the magnification filter mode.

##### Returns

`GPUFilterMode`

#### Set Signature

> **set** **magFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:155](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L155)


Sets the magnification filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | Filter mode |

##### Returns

`void`

***

### maxAnisotropy

#### Get Signature

> **get** **maxAnisotropy**(): `number`

Defined in: [src/resources/sampler/Sampler.ts:182](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L182)


Returns the maximum anisotropy value.

##### Returns

`number`

#### Set Signature

> **set** **maxAnisotropy**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:196](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L196)


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

Defined in: [src/resources/sampler/Sampler.ts:163](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L163)


Returns the minification filter mode.

##### Returns

`GPUFilterMode`

#### Set Signature

> **set** **minFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:174](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L174)


Sets the minification filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUFilterMode` | Filter mode |

##### Returns

`void`

***

### mipmapFilter

#### Get Signature

> **get** **mipmapFilter**(): `GPUMipmapFilterMode`

Defined in: [src/resources/sampler/Sampler.ts:117](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L117)


Returns the mipmap filter mode.

##### Returns

`GPUMipmapFilterMode`

#### Set Signature

> **set** **mipmapFilter**(`value`): `void`

Defined in: [src/resources/sampler/Sampler.ts:128](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/sampler/Sampler.ts#L128)


Sets the mipmap filter mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `GPUMipmapFilterMode` | Filter mode |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Core/classes/ResourceBase.md#uuid)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L125)


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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__fireListenerList`](../namespaces/Core/classes/ResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)
