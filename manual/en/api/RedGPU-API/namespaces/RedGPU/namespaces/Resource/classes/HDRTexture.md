[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / HDRTexture

# Class: HDRTexture

Defined in: [src/resources/texture/hdr/HDRTexture.ts:25](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L25)


2D texture class that uses Radiance HDR (.hdr) files.


Loads .hdr files to create a 2D GPUTexture in rgba16float format. Used as source data for lightmaps, projected textures, or IBL.

### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
```

## Extends

- [`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md)

## Constructors

### Constructor

> **new HDRTexture**(`redGPUContext`, `src`, `onLoad?`, `onError?`): `HDRTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:60](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L60)


Creates an HDRTexture instance.

### Example
```typescript
const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
    console.log('Loaded:', v);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `src` | `SrcInfo` | HDR file path or information |
| `onLoad?` | (`textureInstance?`) => `void` | Load complete callback |
| `onError?` | (`error`) => `void` | Error callback |

#### Returns

`HDRTexture`

#### Overrides

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`constructor`](../namespaces/Core/classes/ManagementResourceBase.md#constructor)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L65)


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

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`gpuDevice`](../namespaces/Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:95](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L95)

GPUTexture object

##### Returns

`GPUTexture`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:91](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L91)

Texture height

##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L90)


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

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`redGPUContext`](../namespaces/Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../namespaces/Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### src

#### Get Signature

> **get** **src**(): `string`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:97](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L97)

Texture source path

##### Returns

`string`

#### Set Signature

> **set** **src**(`value`): `void`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:107](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L107)


Sets the texture source path and starts loading.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `SrcInfo` | Source info to set |

##### Returns

`void`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ManagementResourceBase.ts#L45)


Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../namespaces/Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../namespaces/Core/classes/ManagementResourceBase.md).[`uuid`](../namespaces/Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:93](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L93)

Video memory usage in bytes

##### Returns

`number`

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/resources/texture/hdr/HDRTexture.ts:89](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L89)

Texture width

##### Returns

`number`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L125)


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

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L152)


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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L137)


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

Defined in: [src/resources/texture/hdr/HDRTexture.ts:116](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/hdr/HDRTexture.ts#L116)

Destroys the texture resource.

#### Returns

`void`
