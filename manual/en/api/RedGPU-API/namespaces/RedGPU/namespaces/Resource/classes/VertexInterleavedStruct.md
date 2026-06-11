[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)

Class that defines a structure for interleaving vertex attributes.

* ### Example
```typescript
const struct = new RedGPU.Resource.VertexInterleavedStruct({
  position: RedGPU.Resource.VertexInterleaveType.float32x3,
  uv: RedGPU.Resource.VertexInterleaveType.float32x2
});
```

## Constructors

### Constructor

> **new VertexInterleavedStruct**(`attributes`, `name?`): `VertexInterleavedStruct`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:34](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L34)

Creates a VertexInterleavedStruct instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, [`TypeInterleave`](../type-aliases/TypeInterleave.md)\> | `undefined` | Attribute definition map |
| `name` | `string` | `''` | Structure name (optional) |

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:63](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L63)

Returns the total stride (byte size).

##### Returns

`number`

- Total stride size

***

### attributes

#### Get Signature

> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:54](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L54)

Returns the array of GPU vertex attributes.

##### Returns

`any`[]

- Vertex attributes array

***

### define

#### Get Signature

> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:72](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L72)

Returns the internal attribute definition map.

##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

- Copy of attribute definition map

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:45](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L45)

Returns the label (name) of the structure.

##### Returns

`string`

- Structure label

## Methods

### getAttributeOffset()

> **getAttributeOffset**(`attributeName`): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:82](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L82)

Returns the offset (float unit index) of a specific attribute.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | Attribute name |

#### Returns

`number`

Offset in float units
