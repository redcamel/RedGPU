[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Box

# Class: Box

Defined in: [src/primitive/Box.ts:19](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/Box.ts#L19)

Box(박스) 기본 도형 클래스입니다.

6면체 박스의 정점 및 인덱스 데이터를 생성하여 관리하며, Mesh의 geometry로 사용됩니다.

### Example
```typescript
const boxGeometry = new RedGPU.Box(redGPUContext);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/box/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Box**(`redGPUContext`, `width?`, `height?`, `depth?`, `widthSegments?`, `heightSegments?`, `depthSegments?`): `Box`

Defined in: [src/primitive/Box.ts:32](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/primitive/Box.ts#L32)

Box 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1` | 박스 너비 (기본값 1)
| `height` | `number` | `1` | 박스 높이 (기본값 1)
| `depth` | `number` | `1` | 박스 깊이 (기본값 1)
| `widthSegments` | `number` | `1` | 가로(X축) 세그먼트 수 (기본값 1)
| `heightSegments` | `number` | `1` | 세로(Y축) 세그먼트 수 (기본값 1)
| `depthSegments` | `number` | `1` | 깊이(Z축) 세그먼트 수 (기본값 1)

#### Returns

`Box`

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
