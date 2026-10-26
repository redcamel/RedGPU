[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleaveType

# Class: VertexInterleaveType

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L25)

Class that provides interleaved format specifications for vertex data.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
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

> <span class="readonly-badge">readonly</span> **get** `static` **float32**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L34)

Returns the float32 format (1 element, 4 bytes).

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32 interleave format information

***

### float32x2

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x2**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L46)

Returns the float32x2 format (2 elements, 8 bytes).

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x2 interleave format information

***

### float32x3

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x3**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L58)

Returns the float32x3 format (3 elements, 12 bytes).

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x3 interleave format information

***

### float32x4

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L70)

Returns the float32x4 format (4 elements, 16 bytes).

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x4 interleave format information

***

### uint32x4

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **uint32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L82)

Returns the uint32x4 format (4 elements, 16 bytes).

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

uint32x4 interleave format information
