[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateStorageBuffer

# Class: ResourceStateStorageBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L14)

Class that represents the resource management state of `StorageBuffer`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateStorageBuffer**(`buffer`): `ResourceStateStorageBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L35)

Creates a ResourceStateStorageBuffer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`StorageBuffer`](../../../classes/StorageBuffer.md) | Target `StorageBuffer` instance to manage |

#### Returns

`ResourceStateStorageBuffer`

## Properties

### buffer

> **buffer**: [`StorageBuffer`](../../../classes/StorageBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L19)

Managed storage buffer instance

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L24)

Unique identifier (UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L48)

Gets or sets the resource reference count.

##### Returns

`number`

Current reference count

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L52)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
