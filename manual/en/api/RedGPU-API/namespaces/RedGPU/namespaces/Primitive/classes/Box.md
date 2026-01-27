[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Box

# Class: Box

Defined in: [src/primitive/Box.ts:19](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/Box.ts#L19)


Box primitive geometry class.


Generates and manages vertex and index data for a hexahedral box, used as geometry for a Mesh.

* ### Example
```typescript
const boxGeometry = new RedGPU.Primitive.Box(redGPUContext);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/box/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Box**(`redGPUContext`, `width`, `height`, `depth`, `wSegments`, `hSegments`, `dSegments`, `uvSize`): `Box`

Defined in: [src/primitive/Box.ts:120](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/Box.ts#L120)


Creates an instance of Box.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1` | Box width (default 1) |
| `height` | `number` | `1` | Box height (default 1) |
| `depth` | `number` | `1` | Box depth (default 1) |
| `wSegments` | `number` | `1` | Width (X-axis) segments (default 1) |
| `hSegments` | `number` | `1` | Height (Y-axis) segments (default 1) |
| `dSegments` | `number` | `1` | Depth (Z-axis) segments (default 1) |
| `uvSize` | `number` | `1` | UV scale (default 1) |

#### Returns

`Box`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L86)


Returns the GPU render information.

##### Returns

`object`


Object containing buffer layouts array

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L110)


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

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L98)


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

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L122)


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

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L67)


Returns the default vertex layout structure (Position, Normal, UV).

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)


Vertex interleaved struct object

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/primitive/core/Primitive.ts#L138)

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
