[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Sphere

# Class: Sphere

Defined in: [src/primitive/Sphere.ts:21](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/Sphere.ts#L21)

Sphere(구) 기본 도형 클래스입니다.


반지름, 세그먼트 등을 기반으로 3D 구 형태의 데이터를 생성하여 관리합니다.


* ### Example
```typescript
// 반지름 1, 32x16 세그먼트 구 생성
const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 16);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/sphere/"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Sphere**(`redGPUContext`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `uvSize`): `Sphere`

Defined in: [src/primitive/Sphere.ts:114](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/primitive/Sphere.ts#L114)

Sphere 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `1` | 구 반지름 (기본값 1)
| `widthSegments` | `number` | `16` | 가로 세그먼트 수 (기본값 16, 최소 3)
| `heightSegments` | `number` | `16` | 세로 세그먼트 수 (기본값 16, 최소 2)
| `phiStart` | `number` | `0` | 수평 시작 각도 (라디안, 기본값 0)
| `phiLength` | `number` | `...` | 수평 각도 길이 (라디안, 기본값 2*PI)
| `thetaStart` | `number` | `0` | 수직 시작 각도 (라디안, 기본값 0)
| `thetaLength` | `number` | `Math.PI` | 수직 각도 길이 (라디안, 기본값 PI)
| `uvSize` | `number` | `1` | UV 스케일 (기본값 1)

#### Returns

`Sphere`

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
