[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / Primitive

# Class: Primitive

Defined in: [src/primitive/core/Primitive.ts:16](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L16)

모든 기본 도형(Primitive)의 기반이 되는 베이스 클래스입니다.

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

Defined in: [src/primitive/core/Primitive.ts:34](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L34)

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

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L51) |

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L47)

캐싱된 정점 인터리브 구조를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/primitive/core/Primitive.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `params` | `Record`\<`string`, `any`\> |

#### Returns

`string`
