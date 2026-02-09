[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleaveType

# Class: VertexInterleaveType

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:13](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L13)


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

> **get** `static` **float32**(): `TypeInterleave`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L18)


float32 format (1 element, 4 bytes)

##### Returns

`TypeInterleave`

***

### float32x2

#### Get Signature

> **get** `static` **float32x2**(): `TypeInterleave`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:26](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L26)


float32x2 format (2 elements, 8 bytes)

##### Returns

`TypeInterleave`

***

### float32x3

#### Get Signature

> **get** `static` **float32x3**(): `TypeInterleave`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:34](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L34)


float32x3 format (3 elements, 12 bytes)

##### Returns

`TypeInterleave`

***

### float32x4

#### Get Signature

> **get** `static` **float32x4**(): `TypeInterleave`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:42](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L42)


float32x4 format (4 elements, 16 bytes)

##### Returns

`TypeInterleave`
