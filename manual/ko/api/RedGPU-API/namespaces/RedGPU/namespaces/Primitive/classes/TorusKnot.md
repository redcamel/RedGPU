[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / TorusKnot

# Class: TorusKnot

Defined in: [src/primitive/TorusKnot.ts:20](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/TorusKnot.ts#L20)

TorusKnot(토러스-노트, 매듭 토러스) 기본 도형 클래스입니다.

반지름, 튜브 두께, 매듭 파라미터 등을 기반으로 3D 매듭형 도넛 데이터를 생성하여 관리합니다.

### Example
```typescript
// p=2, q=3 매듭 토러스 생성
const torusKnot = new RedGPU.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/torusKnot/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new TorusKnot**(`redGPUContext`, `radius?`, `tubeRadius?`, `tubularSegments?`, `radialSegments?`, `windingsAroundAxis?`, `windingsAroundCircle?`): `TorusKnot`

Defined in: [src/primitive/TorusKnot.ts:33](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/TorusKnot.ts#L33)

TorusKnot 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `radius` | `number` | `1` | 전체 반지름 (기본값 1)
| `tubeRadius` | `number` | `0.4` | 튜브(단면) 반지름 (기본값 0.4)
| `tubularSegments` | `number` | `64` | 둘레 세그먼트 수 (기본값 64, 최소 3)
| `radialSegments` | `number` | `8` | 단면 세그먼트 수 (기본값 8, 최소 3)
| `windingsAroundAxis` | `number` | `2` | 매듭이 중심축을 따라 회전하는 횟수 (p, 기본값 2)
| `windingsAroundCircle` | `number` | `3` | 매듭이 전체 둘레를 따라 회전하는 횟수 (q, 기본값 3)

#### Returns

`TorusKnot`

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

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L51) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L47)

캐싱된 정점 인터리브 구조를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/core/Primitive.ts#L68)

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
