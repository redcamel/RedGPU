[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Box

# Class: Box

Defined in: [src/primitive/Box.ts:19](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/Box.ts#L19)

Box(박스) 기본 도형 클래스입니다.


6면체 박스의 정점 및 인덱스 데이터를 생성하여 관리하며, Mesh의 geometry로 사용됩니다.


* ### Example
```typescript
const boxGeometry = new RedGPU.Primitive.Box(redGPUContext);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/box/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Box**(`redGPUContext`, `width`, `height`, `depth`, `wSegments`, `hSegments`, `dSegments`, `uvSize`): `Box`

Defined in: [src/primitive/Box.ts:120](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/Box.ts#L120)

Box 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1` | 박스 너비 (기본값 1)
| `height` | `number` | `1` | 박스 높이 (기본값 1)
| `depth` | `number` | `1` | 박스 깊이 (기본값 1)
| `wSegments` | `number` | `1` | 가로(X축) 세그먼트 수 (기본값 1)
| `hSegments` | `number` | `1` | 세로(Y축) 세그먼트 수 (기본값 1)
| `dSegments` | `number` | `1` | 깊이(Z축) 세그먼트 수 (기본값 1)
| `uvSize` | `number` | `1` | UV 스케일 (기본값 1)

#### Returns

`Box`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L86)

GPU 렌더 정보를 반환합니다.


##### Returns

`object`

버퍼 레이아웃 배열을 포함한 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:86](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L86) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:110](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L110)

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

Defined in: [src/primitive/core/Primitive.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L98)

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

Defined in: [src/primitive/core/Primitive.ts:122](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L122)

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

Defined in: [src/primitive/core/Primitive.ts:67](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L67)

기본 정점 레이아웃 구조(Position, Normal, UV)를 반환합니다.


##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

정점 인터리브 구조 객체


#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### \_setData()

> **\_setData**(`geometry`): `void`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/core/Primitive.ts#L138)

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
