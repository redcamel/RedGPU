[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateUniformBuffer

# Class: ResourceStateUniformBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L14)

Class that represents the resource management state of `UniformBuffer`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateUniformBuffer**(`buffer`): `ResourceStateUniformBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L35)

Creates a ResourceStateUniformBuffer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`UniformBuffer`](../../../classes/UniformBuffer.md) | Target `UniformBuffer` instance to manage |

#### Returns

`ResourceStateUniformBuffer`

## Properties

### buffer

> **buffer**: [`UniformBuffer`](../../../classes/UniformBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L19)

Managed uniform buffer instance

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L24)

Unique identifier (UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L48)

Gets or sets the resource reference count.

##### Returns

`number`

Current reference count

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L52)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
