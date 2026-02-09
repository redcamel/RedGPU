[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / Primitive

# Class: Primitive

Defined in: [src/primitive/core/Primitive.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L25)

모든 기본 도형(Primitive)의 기반이 되는 베이스 클래스입니다.


정점 버퍼, 인덱스 버퍼, GPU 렌더 레이아웃 정보 및 AABB 바운딩 박스를 관리합니다.


### Example
```typescript
const primitive = new RedGPU.Core.Primitive(redGPUContext);
```

## Extended by

- [`Plane`](../../../classes/Plane.md)
- [`Sphere`](../../../classes/Sphere.md)
- [`Torus`](../../../classes/Torus.md)
- [`TorusKnot`](../../../classes/TorusKnot.md)
- [`Circle`](../../../classes/Circle.md)
- [`Cylinder`](../../../classes/Cylinder.md)
- [`Box`](../../../classes/Box.md)
- [`Capsule`](../../../classes/Capsule.md)
- [`Ground`](../../../classes/Ground.md)

## Constructors

### Constructor

> **new Primitive**(`redGPUContext`): `Primitive`

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L55)

Primitive 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`Primitive`

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L86)

GPU 렌더 정보를 반환합니다.


##### Returns

`object`

버퍼 레이아웃 배열을 포함한 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L86) |

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L110)

현재 인덱스 버퍼를 반환합니다.


##### Returns

[`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

IndexBuffer 인스턴스


***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L98)

현재 정점 버퍼를 반환합니다.


##### Returns

[`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

VertexBuffer 인스턴스


***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L122)

지오메트리의 AABB 바운딩 볼륨을 반환합니다.


##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

AABB 인스턴스


***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L67)

기본 정점 레이아웃 구조(Position, Normal, UV)를 반환합니다.


##### Returns

[`VertexInterleavedStruct`](../../../../Resource/classes/VertexInterleavedStruct.md)

정점 인터리브 구조 객체


## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/primitive/core/Primitive.ts#L138)

**`Internal`**

지오메트리 데이터를 통해 내부 버퍼와 렌더 정보를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `geometry` | [`Geometry`](../../../../../classes/Geometry.md) | 설정할 Geometry 인스턴스

#### Returns

`void`
