[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / PostEffectTexturePool

# Class: PostEffectTexturePool

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:25](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L25)

Texture pooling class for post-processing.

Reduces video memory occupancy and creation/destruction overhead by reusing temporary textures generated during post-processing.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// View3D의 postEffectManager를 통해 접근합니다.
// Access through the postEffectManager of View3D.
const texturePool = view.postEffectManager.texturePool;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new PostEffectTexturePool**(`redGPUContext`): `PostEffectTexturePool`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:43](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L43)

Creates a PostEffectTexturePool instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 |

#### Returns

`PostEffectTexturePool`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### activeCount

#### Get Signature

> **get** **activeCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L80)

Returns the number of currently active textures.

##### Returns

`number`

Active texture count

***

### allocationCount

#### Get Signature

> **get** **allocationCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:118](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L118)

Returns the total number of newly created textures.

##### Returns

`number`

Total allocation count

***

### hitRate

#### Get Signature

> **get** **hitRate**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:130](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L130)

Returns the reuse hit rate. (0~1)

##### Returns

`number`

Hit rate (between 0 and 1)

***

### idleCount

#### Get Signature

> **get** **idleCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:92](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L92)

Returns the number of idle textures waiting in the pool.

##### Returns

`number`

Idle texture count

***

### peakActiveCount

#### Get Signature

> **get** **peakActiveCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:106](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L106)

Returns the historical peak number of concurrently active textures.

##### Returns

`number`

Peak active texture count

***

### totalCount

#### Get Signature

> **get** **totalCount**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L68)

Returns the total number of textures in the pool (active + idle).

##### Returns

`number`

Total texture count

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L56)

Returns the total video memory usage (bytes) in the pool.

##### Returns

`number`

Video memory usage in bytes

## Methods

### allocResult()

> **allocResult**(`width`, `height`, `format?`): [`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:174](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L174)

Gets a suitable texture from the pool or creates a new one, returning it as IPostEffectResult.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `width` | `number` | `undefined` | Texture width |
| `height` | `number` | `undefined` | Texture height |
| `format` | `GPUTextureFormat` | `'rgba16float'` | Texture format (Default: 'rgba16float') |

#### Returns

[`IPostEffectResult`](../interfaces/IPostEffectResult.md)

Allocated texture and view information object

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:218](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L218)

Destroys all textures in the pool.

#### Returns

`void`

***

### getDetails()

> **getDetails**(): `any`[]

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:143](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L143)

Returns the detailed breakdown of the pool.

#### Returns

`any`[]

Array of detailed pool status objects

***

### release()

> **release**(`texture`): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:190](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L190)

Returns a specific texture to the pool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | GPUTexture to return |

#### Returns

`void`

***

### releaseAll()

> **releaseAll**(): `void`

Defined in: [src/postEffect/core/PostEffectTexturePool.ts:204](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/postEffect/core/PostEffectTexturePool.ts#L204)

Returns all active textures to the pool.

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
