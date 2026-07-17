[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleaveType

# Class: VertexInterleaveType

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:13](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L13)

Class that defines the interleaved format of vertex data.

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

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L18)

float32 format (1 element, 4 bytes)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x2

#### Get Signature

> **get** `static` **float32x2**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:26](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L26)

float32x2 format (2 elements, 8 bytes)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x3

#### Get Signature

> **get** `static` **float32x3**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:34](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L34)

float32x3 format (3 elements, 12 bytes)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### float32x4

#### Get Signature

> **get** `static` **float32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:38](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L38)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

***

### uint32x4

#### Get Signature

> **get** `static` **uint32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L46)

uint32x4 format (4 elements, 16 bytes)

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)
