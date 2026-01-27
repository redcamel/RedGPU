[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / TorusKnot

# Class: TorusKnot

Defined in: [src/primitive/TorusKnot.ts:20](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/TorusKnot.ts#L20)

TorusKnot(토러스-노트, 매듭 토러스) 기본 도형 클래스입니다.


반지름, 튜브 두께, 매듭 파라미터 등을 기반으로 3D 매듭형 도넛 데이터를 생성하여 관리합니다.


* ### Example
```typescript
// p=2, q=3 매듭 토러스 생성
const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/torusNut/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new TorusKnot**(`redGPUContext`, `radius`, `tube`, `tubularSegments`, `radialSegments`, `p`, `q`): `TorusKnot`

Defined in: [src/primitive/TorusKnot.ts:170](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/TorusKnot.ts#L170)

TorusKnot 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `1` | 전체 반지름 (기본값 1)
| `tube` | `number` | `0.4` | 튜브(단면) 반지름 (기본값 0.4)
| `tubularSegments` | `number` | `64` | 둘레 세그먼트 수 (기본값 64, 최소 3)
| `radialSegments` | `number` | `8` | 단면 세그먼트 수 (기본값 8, 최소 3)
| `p` | `number` | `2` | 매듭 파라미터 p (기본값 2)
| `q` | `number` | `3` | 매듭 파라미터 q (기본값 3)

#### Returns

`TorusKnot`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L86)

GPU 렌더 정보를 반환합니다.


##### Returns

`object`

버퍼 레이아웃 배열을 포함한 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L110)

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

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L98)

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

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L122)

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

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L67)

기본 정점 레이아웃 구조(Position, Normal, UV)를 반환합니다.


##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

정점 인터리브 구조 객체


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/primitive/core/Primitive.ts#L138)

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
