[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / Primitive

# Class: Primitive

Defined in: [src/primitive/core/Primitive.ts:16](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L16)

Base class for all primitive geometries.

## Extended by

- [`Plane`](../../../classes/Plane.md)
- [`Sphere`](../../../classes/Sphere.md)
- [`Torus`](../../../classes/Torus.md)
- [`TorusKnot`](../../../classes/TorusKnot.md)
- [`Circle`](../../../classes/Circle.md)
- [`Cone`](../../../classes/Cone.md)
- [`Cylinder`](../../../classes/Cylinder.md)
- [`Box`](../../../classes/Box.md)
- [`RoundedBox`](../../../classes/RoundedBox.md)
- [`Capsule`](../../../classes/Capsule.md)
- [`Ground`](../../../classes/Ground.md)
- [`Ring`](../../../classes/Ring.md)

## Constructors

### Constructor

> **new Primitive**(`redGPUContext`, `uniqueKey`, `makeData`): `Primitive`

Defined in: [src/primitive/core/Primitive.ts:34](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `uniqueKey` | `string` |
| `makeData` | () => [`Geometry`](../../../../../classes/Geometry.md) |

#### Returns

`Primitive`

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L51) |

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L47)


##### Returns

[`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/primitive/core/Primitive.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `params` | `Record`\<`string`, `any`\> |

#### Returns

`string`
