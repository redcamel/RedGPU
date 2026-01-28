[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Circle

# Class: Circle

Defined in: [src/primitive/Circle.ts:20](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/Circle.ts#L20)

Circle(원) 기본 도형 클래스입니다.


반지름, 세그먼트, 시작 각도 등을 기반으로 2D 원형 데이터를 생성하여 관리합니다.


* ### Example
```typescript
// 반지름 2, 세그먼트 64짜리 원 생성
const circle = new RedGPU.Primitive.Circle(redGPUContext, 2, 64);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/circle/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Circle**(`redGPUContext`, `radius`, `segments`, `thetaStart`, `thetaLength`): `Circle`

Defined in: [src/primitive/Circle.ts:85](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/Circle.ts#L85)

Circle 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `1` | 원 반지름 (기본값 1)
| `segments` | `number` | `32` | 세그먼트 수 (기본값 32, 최소 3)
| `thetaStart` | `number` | `0` | 시작 각도 (라디안, 기본값 0)
| `thetaLength` | `number` | `...` | 원호 각도 (라디안, 기본값 2*PI)

#### Returns

`Circle`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L86)

GPU 렌더 정보를 반환합니다.


##### Returns

`object`

버퍼 레이아웃 배열을 포함한 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L110)

현재 인덱스 버퍼를 반환합니다.


##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

IndexBuffer 인스턴스


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L98)

현재 정점 버퍼를 반환합니다.


##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

VertexBuffer 인스턴스


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L122)

지오메트리의 AABB 바운딩 볼륨을 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

AABB 인스턴스


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L67)

기본 정점 레이아웃 구조(Position, Normal, UV)를 반환합니다.


##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

정점 인터리브 구조 객체


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/primitive/core/Primitive.ts#L138)

**`Internal`**

지오메트리 데이터를 통해 내부 버퍼와 렌더 정보를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `geometry` | [`Geometry`](../../../classes/Geometry.md) | 설정할 Geometry 인스턴스

#### Returns

`void`

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`_setData`](../namespaces/Core/classes/Primitive.md#_setdata)
