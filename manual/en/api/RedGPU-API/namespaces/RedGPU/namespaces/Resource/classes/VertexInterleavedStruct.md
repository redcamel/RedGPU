[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)


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

> **new VertexInterleavedStruct**(`attributes`, `name`): `VertexInterleavedStruct`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:34](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L34)


Creates a VertexInterleavedStruct instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, `TypeInterleave`\> | `undefined` | Attribute definition map |
| `name` | `string` | `''` | Structure name (optional) |

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:60](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L60)


Returns the total stride (byte size).

##### Returns

`number`

***

### attributes

#### Get Signature

> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:52](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L52)


Returns the array of GPU vertex attributes.

##### Returns

`any`[]

***

### define

#### Get Signature

> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:68](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L68)


Returns the internal attribute definition map.

##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:44](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L44)


Returns the label (name) of the structure.

##### Returns

`string`
