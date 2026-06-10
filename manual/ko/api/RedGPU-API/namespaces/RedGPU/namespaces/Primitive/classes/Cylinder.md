[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Cylinder

# Class: Cylinder

Defined in: [src/primitive/Cylinder.ts:19](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/Cylinder.ts#L19)

Cylinder(실린더) 기본 도형 클래스입니다.

상/하단 반지름, 높이 등을 기반으로 실린더(원기둥) 형태의 데이터를 생성하여 관리합니다.

### Example
```typescript
const cylinder = new RedGPU.Cylinder(redGPUContext, 1, 1, 2);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/cylinder/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Cylinder**(`redGPUContext`, `radiusTop?`, `radiusBottom?`, `height?`, `radialSegments?`, `heightSegments?`, `capTop?`, `capBottom?`, `thetaStart?`, `thetaLength?`, `isRadialTop?`, `isRadialBottom?`): `Cylinder`

Defined in: [src/primitive/Cylinder.ts:37](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/Cylinder.ts#L37)

Cylinder 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radiusTop` | `number` | `1` | 상단 반지름 (기본값 1)
| `radiusBottom` | `number` | `1` | 하단 반지름 (기본값 1)
| `height` | `number` | `1` | 높이 (기본값 1)
| `radialSegments` | `number` | `8` | 원주 방향 분할 수 (기본값 8)
| `heightSegments` | `number` | `1` | 높이 방향 분할 수 (기본값 1)
| `capTop` | `boolean` | `true` | 상단 단면을 닫을지 여부 (기본값 true)
| `capBottom` | `boolean` | `true` | 하단 단면을 닫을지 여부 (기본값 true)
| `thetaStart` | `number` | `0.0` | 시작 각도 (라디안, 기본값 0)
| `thetaLength` | `number` | `...` | 원호 각도 (라디안, 기본값 2*PI)
| `isRadialTop` | `boolean` | `false` | 상단 단면의 방사형 UV 여부 (기본값 false)
| `isRadialBottom` | `boolean` | `false` | 하단 단면의 방사형 UV 여부 (기본값 false)

#### Returns

`Cylinder`

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

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L51) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L47)

캐싱된 정점 인터리브 구조를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/Primitive.ts#L68)

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
