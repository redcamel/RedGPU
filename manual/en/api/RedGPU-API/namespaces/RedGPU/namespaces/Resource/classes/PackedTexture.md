[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / PackedTexture

# Class: PackedTexture

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:39](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L39)

Utility class that packs channels from multiple textures into a single texture.

By assigning specific channels from different textures to the r, g, b, and a channels, you can reduce memory usage and increase rendering efficiency.

* ### Example
```typescript
const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
await packed.packing({
  r: texture1.gpuTexture,
  g: texture2.gpuTexture
}, 512, 512);
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new PackedTexture**(`redGPUContext`): `PackedTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:59](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L59)

Creates a PackedTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PackedTexture`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:73](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L73)

Returns the packed result GPUTexture object.

##### Returns

`GPUTexture`

GPUTexture instance

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:138](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L138)

Destroys the instance and manages the cache.

#### Returns

`void`

***

### packing()

> **packing**(`textures`, `width`, `height`, `label?`, `componentMapping?`, `commandEncoder?`): `Promise`\<`void`\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:109](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L109)

Creates a packed texture by combining channels from multiple textures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | \{ `a?`: `GPUTexture`; `b?`: `GPUTexture`; `g?`: `GPUTexture`; `r?`: `GPUTexture`; \} | Source GPUTexture object map for each r/g/b/a channel |
| `textures.a?` | `GPUTexture` | - |
| `textures.b?` | `GPUTexture` | - |
| `textures.g?` | `GPUTexture` | - |
| `textures.r?` | `GPUTexture` | - |
| `width?` | `number` | Resulting texture width |
| `height?` | `number` | Resulting texture height |
| `label?` | `string` | Texture label (optional) |
| `componentMapping?` | [`ComponentMapping`](../type-aliases/ComponentMapping.md) | Component mapping info (optional) |
| `commandEncoder?` | `GPUCommandEncoder` | Command Encoder |

#### Returns

`Promise`\<`void`\>

***

### getCacheMap()

> `static` **getCacheMap**(): `Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:85](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/resources/texture/packedTexture/PackedTexture.ts#L85)

Returns the packed texture cache map.

#### Returns

`Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>

Cache map object


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
