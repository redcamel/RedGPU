[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreVertexBuffer](../README.md) / VertexInterleavedStructElement

# Class: VertexInterleavedStructElement

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L14)

Class that defines an individual attribute element of a vertex interleaved struct.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new VertexInterleavedStructElement**(`attributeName`, `attributeStride`, `interleaveType`): `VertexInterleavedStructElement`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L45)

Creates a VertexInterleavedStructElement instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | Vertex attribute name |
| `attributeStride` | `number` | Vertex attribute stride in bytes |
| `interleaveType` | [`TypeInterleave`](../../../type-aliases/TypeInterleave.md) | Interleave format information |

#### Returns

`VertexInterleavedStructElement`

## Properties

### attributeName

> **attributeName**: `string`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L19)

Vertex attribute name

***

### attributeStride

> **attributeStride**: `number`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L24)

Vertex attribute stride in bytes

***

### interleaveType

> **interleaveType**: [`TypeInterleave`](../../../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L29)

Interleave format information
