[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / CubeTexture

# Class: CubeTexture

Defined in: [src/resources/texture/CubeTexture.ts:30](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L30)

Cube texture class that uses 6 images.

* ### Example
```typescript
const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
  'right.png', 'left.png',
  'top.png', 'bottom.png',
  'front.png', 'back.png'
]);
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new CubeTexture**(`redGPUContext`, `srcList`, `useMipMap?`, `onLoad?`, `onError?`, `format?`): `CubeTexture`

Defined in: [src/resources/texture/CubeTexture.ts:82](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L82)

Creates a CubeTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `srcList` | [`CubeSrcInfo`](../type-aliases/CubeSrcInfo.md) | `undefined` | Cube texture source information (Array of URLs or object) |
| `useMipMap` | `boolean` | `true` | Whether to use mipmaps (default: true) |
| `onLoad?` | (`cubeTextureInstance?`) => `void` | `undefined` | Load complete callback |
| `onError?` | (`error`) => `void` | `undefined` | Error callback |
| `format?` | `GPUTextureFormat` | `undefined` | Texture format (optional) |

#### Returns

`CubeTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Properties

### defaultViewDescriptor

> `static` **defaultViewDescriptor**: `GPUTextureViewDescriptor`

Defined in: [src/resources/texture/CubeTexture.ts:32](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L32)

Default view descriptor

## Accessors

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/CubeTexture.ts:146](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L146)

Returns the GPUTexture object.

##### Returns

`GPUTexture`

GPUTexture instance

***

### mipLevelCount

#### Get Signature

> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:158](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L158)

Returns the number of mipmap levels.

##### Returns

`number`

Number of mipmap levels

***

### srcList

#### Get Signature

> **get** **srcList**(): `string`[]

Defined in: [src/resources/texture/CubeTexture.ts:170](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L170)

Returns the list of texture source paths.

##### Returns

`string`[]

List of source paths

#### Set Signature

> **set** **srcList**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:182](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L182)

Sets the list of texture source paths and starts loading.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`CubeSrcInfo`](../type-aliases/CubeSrcInfo.md) | Cube texture source info |

##### Returns

`void`

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/CubeTexture.ts:196](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L196)

Returns whether mipmaps are used.

##### Returns

`boolean`

Whether mipmaps are used

#### Set Signature

> **set** **useMipmap**(`value`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:208](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L208)

Sets whether to use mipmaps and recreates the texture.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use mipmaps |

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/CubeTexture.ts:134](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L134)

Returns the video memory usage in bytes.

##### Returns

`number`

Video memory usage in bytes

***

### viewDescriptor

#### Get Signature

> **get** **viewDescriptor**(): `object`

Defined in: [src/resources/texture/CubeTexture.ts:119](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L119)

Returns the view descriptor.

##### Returns

GPUTextureViewDescriptor object

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `arrayLayerCount?` | `number` | How many array layers, starting with [GPUTextureViewDescriptor#baseArrayLayer](#viewdescriptorviewdescriptor), are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1845 |
| `aspect?` | `GPUTextureAspect` | Which GPUTextureAspect \| aspect(s) of the texture are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1827 |
| `baseArrayLayer?` | `number` | The index of the first array layer accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1840 |
| `baseMipLevel?` | `number` | The first (most detailed) mipmap level accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1831 |
| `dimension?` | `GPUTextureViewDimension` | The dimension to view the texture as. | node\_modules/@webgpu/types/dist/index.d.ts:1814 |
| `format?` | `GPUTextureFormat` | The format of the texture view. Must be either the GPUTextureDescriptor#format of the texture or one of the GPUTextureDescriptor#viewFormats specified during its creation. | node\_modules/@webgpu/types/dist/index.d.ts:1810 |
| `label?` | `string` | The initial value of GPUObjectBase#label \| GPUObjectBase.label. | node\_modules/@webgpu/types/dist/index.d.ts:1058 |
| `mipLevelCount` | `number` | - | [src/resources/texture/CubeTexture.ts:122](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L122) |
| `swizzle?` | `string` | A string of length four, with each character mapping to the texture view's red/green/blue/alpha channels, respectively. When accessed by a shader, the red/green/blue/alpha channels are replaced by the value corresponding to the component specified in `swizzle[0]`, `swizzle[1]`, `swizzle[2]`, and `swizzle[3]`, respectively: - `"r"`: Take its value from the red channel of the texture. - `"g"`: Take its value from the green channel of the texture. - `"b"`: Take its value from the blue channel of the texture. - `"a"`: Take its value from the alpha channel of the texture. - `"0"`: Force its value to 0. - `"1"`: Force its value to 1. Requires the GPUFeatureName `"texture-component-swizzle"` feature to be enabled. | node\_modules/@webgpu/types/dist/index.d.ts:1860 |
| `usage?` | `number` | The allowed GPUTextureUsage \| usage(s) for the texture view. Must be a subset of the GPUTexture#usage flags of the texture. If 0, defaults to the full set of GPUTexture#usage flags of the texture. Note: If the view's [GPUTextureViewDescriptor#format](#viewdescriptorviewdescriptor) doesn't support all of the texture's GPUTextureDescriptor#usages, the default will fail, and the view's [GPUTextureViewDescriptor#usage](#viewdescriptorviewdescriptor) must be specified explicitly. | node\_modules/@webgpu/types/dist/index.d.ts:1823 |

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/CubeTexture.ts:214](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L214)

Destroys the texture resource.

#### Returns

`void`

***

### setGPUTextureDirectly()

> **setGPUTextureDirectly**(`gpuTexture`, `cacheKey?`, `useMipmap?`): `void`

Defined in: [src/resources/texture/CubeTexture.ts:239](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/texture/CubeTexture.ts#L239)

Sets the GPUTexture directly.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `gpuTexture` | `GPUTexture` | `undefined` | `GPUTexture` object to set |
| `cacheKey?` | `string` | `undefined` | Cache key (optional) |
| `useMipmap?` | `boolean` | `true` | Whether to use mipmaps (default: true) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`instanceId`](../namespaces/Core/classes/ManagementResourceBase.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`antialiasingManager`](../namespaces/Core/classes/ManagementResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L53)

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L61)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`commandEncoderManager`](../namespaces/Core/classes/ManagementResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManager`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`revision`](../namespaces/Core/classes/ManagementResourceBase.md#revision)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ManagementResourceBase.ts#L45)

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L89)

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`notifyUpdate`](../namespaces/Core/classes/ManagementResourceBase.md#notifyupdate)

***


</details>
