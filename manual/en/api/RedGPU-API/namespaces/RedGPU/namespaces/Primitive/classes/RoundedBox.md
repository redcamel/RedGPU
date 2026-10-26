[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / RoundedBox

# Class: RoundedBox

Defined in: [src/primitive/RoundedBox.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/RoundedBox.ts#L18)

Primitive geometry class that generates vertex and index data for a rounded-edge hexahedral box.

***

### Example
```typescript
const roundedBox = new RedGPU.Primitive.RoundedBox(redGPUContext, 1, 1, 1, 1, 1, 1, 0.1, 4);
```

## See

- [RoundedBox example](https://redcamel.github.io/RedGPU/examples/3d/primitive/roundedBox/)
 - [Primitives example](https://redcamel.github.io/RedGPU/examples/3d/primitive/primitives/)

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors



***

### Constructor

> **new RoundedBox**(`redGPUContext`, `width?`, `height?`, `depth?`, `widthSegments?`, `heightSegments?`, `depthSegments?`, `radius?`, `radiusSegments?`): `RoundedBox`

Defined in: [src/primitive/RoundedBox.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/RoundedBox.ts#L56)

Creates an instance of RoundedBox.

#### Example
```typescript
const roundedBox = new RedGPU.Primitive.RoundedBox(redGPUContext, 1, 1, 1, 1, 1, 1, 0.1, 4);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width?` | `number` | `1` | Width along the X-axis (default: 1) |
| `height?` | `number` | `1` | Height along the Y-axis (default: 1) |
| `depth?` | `number` | `1` | Depth along the Z-axis (default: 1) |
| `widthSegments?` | `number` | `1` | Number of segments along the X-axis (default: 1) |
| `heightSegments?` | `number` | `1` | Number of segments along the Y-axis (default: 1) |
| `depthSegments?` | `number` | `1` | Number of segments along the Z-axis (default: 1) |
| `radius?` | `number` | `0.1` | Corner fillet radius (default: 0.1) |
| `radiusSegments?` | `number` | `4` | Number of segments for the rounded corners (default: 4) |

#### Returns

`RoundedBox`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors



## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`antialiasingManager`](../namespaces/Core/classes/Primitive.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`commandEncoderManager`](../namespaces/Core/classes/Primitive.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuDevice`](../namespaces/Core/classes/Primitive.md#gpudevice)

***

***

### gpuRenderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L83)

Returns buffer layout information required for GPU render pipeline configuration.

##### Returns

`object`

GPU vertex buffer layout object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L83) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

***

### indexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L107)

Returns the index buffer.

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

`IndexBuffer` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`instanceId`](../namespaces/Core/classes/Primitive.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`name`](../namespaces/Core/classes/Primitive.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`redGPUContext`](../namespaces/Core/classes/Primitive.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`resourceManager`](../namespaces/Core/classes/Primitive.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`uuid`](../namespaces/Core/classes/Primitive.md#uuid)

***

***

### vertexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L95)

Returns the vertex buffer.

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

`VertexBuffer` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

***

### volume

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L119)

Returns the local axis-aligned bounding box (AABB) calculated from the vertex data.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

`AABB` instance

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

***

### primitiveInterleaveStruct

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L71)

Returns the vertex interleaved structure shared across primitive geometries.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Vertex interleaved structure (`VertexInterleavedStruct`)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L138)

Generates a unique key string for caching from the primitive name and creation parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Primitive type name |
| `params` | `Record`\<`string`, `any`\> | Primitive creation parameter object (`Record<string, any>`) |

#### Returns

`string`

Generated unique key string

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`generateUniqueKey`](../namespaces/Core/classes/Primitive.md#generateuniquekey)

</details>
