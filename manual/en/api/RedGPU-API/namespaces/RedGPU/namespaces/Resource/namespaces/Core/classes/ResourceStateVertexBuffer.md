[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateVertexBuffer

# Class: ResourceStateVertexBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L14)

Class that represents the resource management state of `VertexBuffer`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateVertexBuffer**(`buffer`): `ResourceStateVertexBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L40)

Creates a ResourceStateVertexBuffer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`VertexBuffer`](../../../classes/VertexBuffer.md) | Target `VertexBuffer` instance to manage |

#### Returns

`ResourceStateVertexBuffer`

## Properties

### buffer

> **buffer**: [`VertexBuffer`](../../../classes/VertexBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L19)

Managed vertex buffer instance

***

### label

> **label**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L24)

Buffer label or name

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L29)

Unique identifier (UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L54)

Gets or sets the resource reference count.

##### Returns

`number`

Current reference count

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L58)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
