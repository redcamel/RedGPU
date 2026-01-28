[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Ground

# Class: Ground

Defined in: [src/primitive/Ground.ts:20](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/Ground.ts#L20)


Ground primitive geometry class.


Generates and manages planar data placed on the XZ plane. Primarily used as a base for floors or terrain.

* ### Example
```typescript
// 10x10 크기의 그라운드 생성
const ground = new RedGPU.Primitive.Ground(redGPUContext, 10, 10);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/ground/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Ground**(`redGPUContext`, `width`, `height`, `wSegments`, `hSegments`, `uvSize`, `flipY`): `Ground`

Defined in: [src/primitive/Ground.ts:92](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/Ground.ts#L92)


Creates an instance of Ground.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1` | Width (default 1) |
| `height` | `number` | `1` | Height (default 1) |
| `wSegments` | `number` | `1` | Width (X-axis) segments (default 1) |
| `hSegments` | `number` | `1` | Height (Z-axis) segments (default 1) |
| `uvSize` | `number` | `1` | UV scale (default 1) |
| `flipY` | `boolean` | `false` | Whether to flip UV on the Y-axis (default false) |

#### Returns

`Ground`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L86)


Returns the GPU render information.

##### Returns

`object`


Object containing buffer layouts array

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L110)


Returns the current index buffer.

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)


IndexBuffer instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L98)


Returns the current vertex buffer.

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)


VertexBuffer instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L122)


Returns the AABB bounding volume of the geometry.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)


AABB instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L67)


Returns the default vertex layout structure (Position, Normal, UV).

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)


Vertex interleaved struct object

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/primitive/core/Primitive.ts#L138)

**`Internal`**


Sets internal buffers and render information using geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `geometry` | [`Geometry`](../../../classes/Geometry.md) | Geometry instance to set |

#### Returns

`void`

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`_setData`](../namespaces/Core/classes/Primitive.md#_setdata)
