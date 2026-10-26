[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)

Class that defines a structure for arranging vertex attributes in an interleaved manner.

### Example
```typescript
const struct = new RedGPU.Resource.VertexInterleavedStruct({
  position: RedGPU.Resource.VertexInterleaveType.float32x3,
  uv: RedGPU.Resource.VertexInterleaveType.float32x2
});
```

## Constructors

### Constructor

> **new VertexInterleavedStruct**(`attributes`, `name?`): `VertexInterleavedStruct`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L35)

Creates a VertexInterleavedStruct instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, [`TypeInterleave`](../type-aliases/TypeInterleave.md)\> | `undefined` | Attribute definition map (`Record<string, TypeInterleave>`) |
| `name?` | `string` | `''` | Structure name (optional) |

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L73)

Returns the total stride (byte size).

##### Returns

`number`

Total stride byte size

***

### attributes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L61)

Returns the array of GPU vertex attributes.

##### Returns

`any`[]

Vertex attributes array

***

### define

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L85)

Returns a copy of the internal attribute definition map.

##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Attribute definition map (`Record<string, VertexInterleavedStructElement>`)

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L49)

Returns the label (name) of the structure.

##### Returns

`string`

Structure label

## Methods

### getAttributeOffset()

> **getAttributeOffset**(`attributeName`): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L100)

Returns the offset index in float units of a specific attribute.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | Attribute name |

#### Returns

`number`

Offset in float units
