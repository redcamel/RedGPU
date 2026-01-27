[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Geometry

# Class: Geometry

Defined in: [src/geometry/Geometry.ts:24](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L24)


A class that manages vertex buffers (VertexBuffer) and index buffers (IndexBuffer) and provides information required for GPU rendering.


Forms a single geometry unit by combining vertex and index data, encapsulating layout information required for the GPU pipeline and AABB (Bounding Box) information of the object.

* ### Example
```typescript
const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## Extends

- [`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md)

## Constructors

### Constructor

> **new Geometry**(`redGPUContext`, `vertexBuffer`, `indexBuffer?`): `Geometry`

Defined in: [src/geometry/Geometry.ts:60](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L60)


Creates a Geometry instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |
| `vertexBuffer` | [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md) | Vertex buffer |
| `indexBuffer?` | [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md) | Index buffer (optional) |

#### Returns

`Geometry`

#### Overrides

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`GeometryGPURenderInfo`](../namespaces/Primitive/namespaces/Core/classes/GeometryGPURenderInfo.md)

Defined in: [src/geometry/Geometry.ts:29](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L29)


Layout information required for GPU pipeline

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ColorMaterial`](../namespaces/Material/classes/ColorMaterial.md).[`cacheKey`](../namespaces/Material/classes/ColorMaterial.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

Defined in: [src/geometry/Geometry.ts:87](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L87)


Returns the index buffer.

##### Returns

[`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

Defined in: [src/geometry/Geometry.ts:79](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L79)


Returns the vertex buffer.

##### Returns

[`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../namespaces/Bound/classes/AABB.md)

Defined in: [src/geometry/Geometry.ts:99](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/geometry/Geometry.ts#L99)


Returns the AABB (Axis-Aligned Bounding Box) information based on the vertex buffer. It is calculated and cached on the first access.

##### Returns

[`AABB`](../namespaces/Bound/classes/AABB.md)


AABB information

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__fireListenerList`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)
