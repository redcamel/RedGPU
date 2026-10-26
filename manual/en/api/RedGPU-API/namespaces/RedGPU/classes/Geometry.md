[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Geometry

# Class: Geometry

Defined in: [src/geometry/Geometry.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L21)

Geometry class that combines a vertex buffer (`VertexBuffer`) and an index buffer (`IndexBuffer`) to manage GPU rendering layout and AABB bounding box information.

***

### Example
```typescript
const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## Extends

- [`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md)

## Constructors



***

### Constructor

> **new Geometry**(`redGPUContext`, `vertexBuffer`, `indexBuffer?`): `Geometry`

Defined in: [src/geometry/Geometry.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L45)

Creates a Geometry instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `vertexBuffer` | [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md) | Vertex buffer |
| `indexBuffer?` | [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md) | Index buffer (optional) |

#### Returns

`Geometry`

#### Overrides

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties



***

### gpuRenderInfo

> **gpuRenderInfo**: [`GeometryGPURenderInfo`](../namespaces/Primitive/namespaces/Core/classes/GeometryGPURenderInfo.md)

Defined in: [src/geometry/Geometry.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L26)

Vertex buffer layout information required for GPU pipeline configuration

## Accessors



***

### indexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexBuffer**(): [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

Defined in: [src/geometry/Geometry.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L80)

Returns the index buffer.

##### Returns

[`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

IndexBuffer instance

***

***

### vertexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexBuffer**(): [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

Defined in: [src/geometry/Geometry.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L68)

Returns the vertex buffer.

##### Returns

[`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

VertexBuffer instance

***

***

### volume

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **volume**(): [`AABB`](../namespaces/Bound/classes/AABB.md)

Defined in: [src/geometry/Geometry.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L92)

Returns the AABB (Axis-Aligned Bounding Box) information based on the vertex buffer. Calculated and cached upon first access.

##### Returns

[`AABB`](../namespaces/Bound/classes/AABB.md)

Calculated AABB instance

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/geometry/Geometry.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/geometry/Geometry.ts#L103)

Destroys the Geometry instance and releases the allocated vertex and index GPU buffers.

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`instanceId`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#revision)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)

</details>
