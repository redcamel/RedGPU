[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Torus

# Class: Torus

Defined in: [src/primitive/Torus.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/Torus.ts#L20)


Torus primitive geometry class.


Generates and manages 3D torus data based on radius, thickness, segments, etc.

### Example
```typescript
// 반지름 2, 두께 0.5짜리 토러스 생성
const torus = new RedGPU.Torus(redGPUContext, 2, 0.5);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Torus**(`redGPUContext`, `radius`, `thickness`, `radialSubdivisions`, `bodySubdivisions`, `startAngle`, `endAngle`): `Torus`

Defined in: [src/primitive/Torus.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/Torus.ts#L106)


Creates an instance of Torus.

### Example
```typescript
const torus = new RedGPU.Torus(redGPUContext, 1, 0.5, 16, 16, 0, Math.PI * 2);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `radius` | `number` | `1` | Major radius (default 1) |
| `thickness` | `number` | `0.5` | Minor radius/thickness (default 0.5) |
| `radialSubdivisions` | `number` | `16` | Radial segments (default 16, min 3) |
| `bodySubdivisions` | `number` | `16` | Tubular segments (default 16, min 3) |
| `startAngle` | `number` | `0` | Starting angle (radians, default 0) |
| `endAngle` | `number` | `...` | Ending angle (radians, default 2*PI) |

#### Returns

`Torus`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L86)


Returns the GPU render information.

##### Returns

`object`


Object containing buffer layouts array

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L110)


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

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L98)


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

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L122)


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

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L67)


Returns the default vertex layout structure (Position, Normal, UV).

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)


Vertex interleaved struct object

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L138)

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
