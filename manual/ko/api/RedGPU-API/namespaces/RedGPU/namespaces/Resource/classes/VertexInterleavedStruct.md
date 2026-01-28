[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)

정점 속성을 인터리브 방식으로 배치하기 위한 구조를 정의하는 클래스입니다.


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

VertexInterleavedStruct 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, `TypeInterleave`\> | `undefined` | 속성 정의 맵
| `name` | `string` | `''` | 구조 이름 (선택)

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:60](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L60)

전체 stride(바이트 크기)를 반환합니다.


##### Returns

`number`

***

### attributes

#### Get Signature

> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:52](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L52)

GPU 정점 속성 배열을 반환합니다.


##### Returns

`any`[]

***

### define

#### Get Signature

> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:68](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L68)

내부 속성 정의 맵을 반환합니다.


##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:44](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L44)

구조의 레이블(이름)을 반환합니다.


##### Returns

`string`
