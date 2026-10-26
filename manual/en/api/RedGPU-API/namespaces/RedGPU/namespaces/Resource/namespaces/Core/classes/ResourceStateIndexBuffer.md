[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateIndexBuffer

# Class: ResourceStateIndexBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L14)

Class that represents the resource management state of `IndexBuffer`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateIndexBuffer**(`buffer`): `ResourceStateIndexBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L40)

Creates a ResourceStateIndexBuffer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`IndexBuffer`](../../../classes/IndexBuffer.md) | Target `IndexBuffer` instance to manage |

#### Returns

`ResourceStateIndexBuffer`

## Properties

### buffer

> **buffer**: [`IndexBuffer`](../../../classes/IndexBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L19)

Managed index buffer instance

***

### label

> **label**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L24)

Buffer label or name

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L29)

Unique identifier (UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L54)

Gets or sets the resource reference count.

##### Returns

`number`

Current reference count

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L58)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
