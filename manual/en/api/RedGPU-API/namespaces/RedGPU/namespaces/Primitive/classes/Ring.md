[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / Ring

# Class: Ring

Defined in: [src/primitive/Ring.ts:20](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/Ring.ts#L20)

Ring primitive geometry class.

Generates and manages 2D ring data based on inner/outer radius, segments, etc.

### Example
```typescript
// 내경 0.5, 외경 1짜리 링 생성
const ring = new RedGPU.Ring(redGPUContext, 0.5, 1);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/ring/" style="width:100%; height:500px;"></iframe>

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors

### Constructor

> **new Ring**(`redGPUContext`, `innerRadius?`, `outerRadius?`, `thetaSegments?`, `phiSegments?`, `thetaStart?`, `thetaLength?`, `isRadial?`): `Ring`

Defined in: [src/primitive/Ring.ts:34](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/Ring.ts#L34)

Creates an instance of Ring.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `innerRadius` | `number` | `0.5` | Inner radius (default 0.5) |
| `outerRadius` | `number` | `1` | Outer radius (default 1) |
| `thetaSegments` | `number` | `8` | Theta segments (default 8) |
| `phiSegments` | `number` | `1` | Phi segments (default 1) |
| `thetaStart` | `number` | `0` | Starting angle (radians, default 0) |
| `thetaLength` | `number` | `...` | Arc angle (radians, default 2*PI) |
| `isRadial` | `boolean` | `false` | Whether to use radial UV (default false) |

#### Returns

`Ring`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### gpuRenderInfo

#### Get Signature

> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L51)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:51](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L51) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:59](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L59)

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:55](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L55)

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:63](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L63)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

### primitiveInterleaveStruct

#### Get Signature

> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:47](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L47)


##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

## Methods

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:68](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/primitive/core/Primitive.ts#L68)

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
