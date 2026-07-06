[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Capsule

# Class: Capsule

Defined in: [src/primitive/Capsule.ts:20](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/Capsule.ts#L20)

Capsule(캡슐) 기본 도형 클래스입니다.

반지름, 실린더 높이 등을 기반으로 캡슐 형태의 정점 및 인덱스 데이터를 생성하여 관리합니다.

### Example
```typescript
// 반지름 0.5, 실린더 높이 1, 세그먼트들을 설정하여 캡슐 생성
const capsule = new RedGPU.Capsule(redGPUContext, 0.5, 1, 32, 1, 12);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/capsule/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Capsule**(`redGPUContext`, `radius?`, `height?`, `radialSegments?`, `heightSegments?`, `capSegments?`): `Capsule`

Defined in: [src/primitive/Capsule.ts:37](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/Capsule.ts#L37)

Capsule 인스턴스를 생성합니다.

### Example
```typescript
const capsule = new RedGPU.Capsule(redGPUContext, 0.5, 1.0, 32, 1, 12);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `0.5` | 반지름 (기본값 0.5)
| `height` | `number` | `1.0` | 실린더 부분 높이 (기본값 1.0)
| `radialSegments` | `number` | `32` | 원주 방향 분할 수 (기본값 32)
| `heightSegments` | `number` | `1` | 실린더 부분의 높이 방향 분할 수 (기본값 1)
| `capSegments` | `number` | `12` | 상/하단 반구의 세로 분할 수 (기본값 12)

#### Returns

`Capsule`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L51) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L47)

캐싱된 정점 인터리브 구조를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/primitive/core/Primitive.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `params` | `Record`\<`string`, `any`\> |

#### Returns

`string`

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`generateUniqueKey`](../namespaces/Core/classes/Primitive.md#generateuniquekey)


</details>
