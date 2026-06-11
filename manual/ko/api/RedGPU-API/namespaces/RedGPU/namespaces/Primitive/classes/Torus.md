[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Torus

# Class: Torus

Defined in: [src/primitive/Torus.ts:20](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/Torus.ts#L20)

Torus(토러스, 도넛) 기본 도형 클래스입니다.

반지름, 두께, 세그먼트 등을 기반으로 3D 도넛 형태의 데이터를 생성하여 관리합니다.

### Example
```typescript
// 반지름 2, 두께 0.5짜리 토러스 생성
const torus = new RedGPU.Torus(redGPUContext, 2, 0.5);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Torus**(`redGPUContext`, `radius?`, `thickness?`, `radialSegments?`, `tubularSegments?`, `thetaStart?`, `thetaLength?`, `capStart?`, `capEnd?`, `isRadialCapStart?`, `isRadialCapEnd?`): `Torus`

Defined in: [src/primitive/Torus.ts:37](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/Torus.ts#L37)

Torus 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `1` | 중심 원 반지름
| `thickness` | `number` | `0.5` | 단면(튜브) 반지름
| `radialSegments` | `number` | `16` | 둘레 세그먼트 수
| `tubularSegments` | `number` | `16` | 단면 세그먼트 수
| `thetaStart` | `number` | `0` | 시작 각도
| `thetaLength` | `number` | `...` | 원호 각도
| `capStart` | `boolean` | `false` | 시작 지점 단면을 닫을지 여부 (기본값 false)
| `capEnd` | `boolean` | `false` | 끝 지점 단면을 닫을지 여부 (기본값 false)
| `isRadialCapStart` | `boolean` | `false` | 시작 단면의 방사형 UV 여부 (기본값 false)
| `isRadialCapEnd` | `boolean` | `false` | 끝 단면의 방사형 UV 여부 (기본값 false)

#### Returns

`Torus`

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

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L51) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L47)

캐싱된 정점 인터리브 구조를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/primitive/core/Primitive.ts#L68)

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
