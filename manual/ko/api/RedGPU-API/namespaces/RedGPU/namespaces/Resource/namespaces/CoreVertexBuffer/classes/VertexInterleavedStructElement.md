[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreVertexBuffer](../README.md) / VertexInterleavedStructElement

# Class: VertexInterleavedStructElement

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L14)

정점 인터리브 구조체의 개별 속성 요소를 정의하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new VertexInterleavedStructElement**(`attributeName`, `attributeStride`, `interleaveType`): `VertexInterleavedStructElement`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L45)

VertexInterleavedStructElement 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | 정점 속성 이름 |
| `attributeStride` | `number` | 정점 속성 스트라이드 (바이트 단위) |
| `interleaveType` | [`TypeInterleave`](../../../type-aliases/TypeInterleave.md) | 인터리브 포맷 정보 |

#### Returns

`VertexInterleavedStructElement`

## Properties

### attributeName

> **attributeName**: `string`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L19)

정점 속성 이름

***

### attributeStride

> **attributeStride**: `number`

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L24)

정점 속성 스트라이드 (바이트 단위)

***

### interleaveType

> **interleaveType**: [`TypeInterleave`](../../../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/vertexBuffer/core/VertexInterleavedStructElement.ts#L29)

인터리브 포맷 정보
