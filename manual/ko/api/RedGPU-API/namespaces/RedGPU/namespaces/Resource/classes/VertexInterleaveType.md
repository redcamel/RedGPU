[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleaveType

# Class: VertexInterleaveType

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:13](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L13)

정점 데이터의 인터리브 형식을 정의하는 클래스입니다.

* ### Example
```typescript
const type = RedGPU.Resource.VertexInterleaveType.float32x3;
```

## Constructors

### Constructor

> **new VertexInterleaveType**(): `VertexInterleaveType`

#### Returns

`VertexInterleaveType`

## Accessors

### float32

#### Get Signature

> **get** `static` **float32**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:18](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L18)

float32 형식 (요소 1개, 4바이트)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x2

#### Get Signature

> **get** `static` **float32x2**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:26](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L26)

float32x2 형식 (요소 2개, 8바이트)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x3

#### Get Signature

> **get** `static` **float32x3**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:34](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L34)

float32x3 형식 (요소 3개, 12바이트)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x4

#### Get Signature

> **get** `static` **float32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:42](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L42)

float32x4 형식 (요소 4개, 16바이트)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)
