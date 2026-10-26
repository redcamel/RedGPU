[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleavedStruct

# Class: VertexInterleavedStruct

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L18)

정점 속성을 인터리브(Interleaved) 방식으로 배치하기 위한 구조를 정의하는 클래스입니다.

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

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L35)

VertexInterleavedStruct 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `attributes` | `Record`\<`string`, [`TypeInterleave`](../type-aliases/TypeInterleave.md)\> | `undefined` | 속성 정의 맵 (`Record<string, TypeInterleave>`) |
| `name?` | `string` | `''` | 구조 이름 (선택) |

#### Returns

`VertexInterleavedStruct`

## Accessors

### arrayStride

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **arrayStride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L73)

전체 stride(바이트 크기)를 반환합니다.

##### Returns

`number`

전체 stride 바이트 크기

***

### attributes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **attributes**(): `any`[]

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L61)

GPU 정점 속성 배열을 반환합니다.

##### Returns

`any`[]

정점 속성 배열

***

### define

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **define**(): `Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L85)

내부 속성 정의 맵 복사본을 반환합니다.

##### Returns

`Record`\<`string`, [`VertexInterleavedStructElement`](../namespaces/CoreVertexBuffer/classes/VertexInterleavedStructElement.md)\>

속성 정의 맵 (`Record<string, VertexInterleavedStructElement>`)

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L49)

구조의 레이블(이름)을 반환합니다.

##### Returns

`string`

구조 레이블

## Methods

### getAttributeOffset()

> **getAttributeOffset**(`attributeName`): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleavedStruct.ts#L100)

특정 속성의 float 단위 오프셋 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attributeName` | `string` | 속성 이름 |

#### Returns

`number`

float 단위 오프셋
