[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)

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

> **new VertexInterleavedStruct**(`attributes`, `name?`): `VertexInterleavedStruct`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:34](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L34)

VertexInterleavedStruct 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, [`TypeInterleave`](../type-aliases/TypeInterleave.md)\> | `undefined` | 속성 정의 맵
| `name` | `string` | `''` | 구조 이름 (선택)

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:63](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L63)

전체 stride(바이트 크기)를 반환합니다.

##### Returns

`number`

- 전체 stride 크기

***

### attributes

#### Get Signature

> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:54](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L54)

GPU 정점 속성 배열을 반환합니다.

##### Returns

`any`[]

- 정점 속성 배열

***

### define

#### Get Signature

> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:72](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L72)

내부 속성 정의 맵을 반환합니다.

##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

- 속성 정의 맵 복사본

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:45](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L45)

구조의 레이블(이름)을 반환합니다.

##### Returns

`string`

- 구조 레이블

## Methods

### getAttributeOffset()

> **getAttributeOffset**(`attributeName`): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:82](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L82)

특정 속성의 오프셋(float 단위 인덱스)을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | 속성 이름

#### Returns

`number`

float 단위 오프셋
