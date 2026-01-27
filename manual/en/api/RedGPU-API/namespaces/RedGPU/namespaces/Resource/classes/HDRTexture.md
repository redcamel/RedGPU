[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / HDRTexture

# Class: HDRTexture

Defined in: [src/resources/texture/hdr/HDRTexture.ts:33](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L33)


Texture class that uses Radiance HDR (.hdr) files.


Generates pre-filtered cubemaps for each roughness through GGX importance sampling.

* ### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new HDRTexture**(`redGPUContext`, `src`, `onLoad?`, `onError?`, `cubeMapSize?`, `useMipMap?`): `HDRTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:71](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L71)


Creates an HDRTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `src` | `SrcInfo` | `undefined` | HDR file path or information |
| `onLoad?` | (`textureInstance?`) => `void` | `undefined` | Load complete callback |
| `onError?` | (`error`) => `void` | `undefined` | Error callback |
| `cubeMapSize?` | `number` | `1024` | Size of one side of the generated cubemap |
| `useMipMap?` | `boolean` | `true` | Whether to use mipmaps (required for IBL) |

#### Returns

`HDRTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`cacheKey`](../namespaces/Core/classes/ManagementResourceBase.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:111](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L111)

GPUTexture object

##### Returns

`GPUTexture`

***

### mipLevelCount

#### Get Signature

> **get** **mipLevelCount**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:116](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L116)

Number of mipmap levels

##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`name`](../namespaces/Core/classes/ManagementResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### src

#### Get Signature

> **get** **src**(): `string`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:121](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L121)

Texture source path

##### Returns

`string`

#### Set Signature

> **set** **src**(`value`): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:126](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L126)

Sets the texture source path and starts loading.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `SrcInfo` |

##### Returns

`void`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### useMipmap

#### Get Signature

> **get** **useMipmap**(): `boolean`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:136](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L136)

Whether to use mipmaps

##### Returns

`boolean`

#### Set Signature

> **set** **useMipmap**(`value`): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:141](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L141)

Sets whether to use mipmaps and recreates the texture.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:106](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L106)

Video memory usage in bytes

##### Returns

`number`

***

### viewDescriptor

#### Get Signature

> **get** **viewDescriptor**(): `object`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:151](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L151)

Returns the view descriptor.

##### Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `arrayLayerCount?` | `number` | How many array layers, starting with [GPUTextureViewDescriptor#baseArrayLayer](CubeTexture.md#viewdescriptorviewdescriptor), are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1848 |
| `aspect?` | `GPUTextureAspect` | Which GPUTextureAspect \| aspect(s) of the texture are accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1830 |
| `baseArrayLayer?` | `number` | The index of the first array layer accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1843 |
| `baseMipLevel?` | `number` | The first (most detailed) mipmap level accessible to the texture view. | node\_modules/@webgpu/types/dist/index.d.ts:1834 |
| `dimension?` | `GPUTextureViewDimension` | The dimension to view the texture as. | node\_modules/@webgpu/types/dist/index.d.ts:1817 |
| `format?` | `GPUTextureFormat` | The format of the texture view. Must be either the GPUTextureDescriptor#format of the texture or one of the GPUTextureDescriptor#viewFormats specified during its creation. | node\_modules/@webgpu/types/dist/index.d.ts:1813 |
| `label?` | `string` | The initial value of GPUObjectBase#label \| GPUObjectBase.label. | node\_modules/@webgpu/types/dist/index.d.ts:1058 |
| `mipLevelCount` | `number` | - | [src/resources/texture/hdr/HDRTexture.ts:154](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L154) |
| `swizzle?` | `string` | A string of length four, with each character mapping to the texture view's red/green/blue/alpha channels, respectively. When accessed by a shader, the red/green/blue/alpha channels are replaced by the value corresponding to the component specified in `swizzle[0]`, `swizzle[1]`, `swizzle[2]`, and `swizzle[3]`, respectively: - `"r"`: Take its value from the red channel of the texture. - `"g"`: Take its value from the green channel of the texture. - `"b"`: Take its value from the blue channel of the texture. - `"a"`: Take its value from the alpha channel of the texture. - `"0"`: Force its value to 0. - `"1"`: Force its value to 1. Requires the GPUFeatureName `"texture-component-swizzle"` feature to be enabled. | node\_modules/@webgpu/types/dist/index.d.ts:1863 |
| `usage?` | `number` | The allowed GPUTextureUsage \| usage(s) for the texture view. Must be a subset of the GPUTexture#usage flags of the texture. If 0, defaults to the full set of GPUTexture#usage flags of the texture. Note: If the view's [GPUTextureViewDescriptor#format](CubeTexture.md#viewdescriptorviewdescriptor) doesn't support all of the texture's GPUTextureDescriptor#usages, the default will fail, and the view's [GPUTextureViewDescriptor#usage](CubeTexture.md#viewdescriptorviewdescriptor) must be specified explicitly. | node\_modules/@webgpu/types/dist/index.d.ts:1826 |

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L125)


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

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../namespaces/Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:176](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L176)

Destroys the texture resource.

#### Returns

`void`

***

### getSupportedFormats()

> `static` **getSupportedFormats**(): `string`[]

Defined in: [src/resources/texture/hdr/HDRTexture.ts:171](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L171)


Returns the list of supported file format extensions.

#### Returns

`string`[]

***

### isSupportedFormat()

> `static` **isSupportedFormat**(`src`): `boolean`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:162](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/texture/hdr/HDRTexture.ts#L162)


Checks if the specified path is a supported HDR format.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `src` | `string` |

#### Returns

`boolean`
