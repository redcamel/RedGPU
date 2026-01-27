[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / Primitive

# Class: Primitive

Defined in: [src/primitive/core/Primitive.ts:25](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L25)


Base class for all primitive geometries.


Manages vertex buffers, index buffers, GPU render layout information, and AABB bounding boxes.

* ### Example
```typescript
const primitive = new RedGPU.Primitive.Core.Primitive(redGPUContext);
```

## Extended by

- [`Plane`](../../../classes/Plane.md)
- [`Sphere`](../../../classes/Sphere.md)
- [`Torus`](../../../classes/Torus.md)
- [`TorusKnot`](../../../classes/TorusKnot.md)
- [`Circle`](../../../classes/Circle.md)
- [`Cylinder`](../../../classes/Cylinder.md)
- [`Box`](../../../classes/Box.md)
- [`Ground`](../../../classes/Ground.md)

## Constructors

### Constructor

> **new Primitive**(`redGPUContext`): `Primitive`

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L55)


Creates an instance of Primitive.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`Primitive`

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L86)


Returns the GPU render information.

##### Returns

`object`


Object containing buffer layouts array

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L86) |

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L110)


Returns the current index buffer.

##### Returns

[`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)


IndexBuffer instance

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L98)


Returns the current vertex buffer.

##### Returns

[`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)


VertexBuffer instance

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L122)


Returns the AABB bounding volume of the geometry.

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)


AABB instance

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L67)


Returns the default vertex layout structure (Position, Normal, UV).

##### Returns

[`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)


Vertex interleaved struct object

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/primitive/core/Primitive.ts#L138)

**`Internal`**


Sets internal buffers and render information using geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `geometry` | [`Geometry`](../../../../../classes/Geometry.md) | Geometry instance to set |

#### Returns

`void`
