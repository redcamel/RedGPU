[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateBitmapTexture

# Class: ResourceStateBitmapTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L16)

Class representing the resource management state of 2D bitmap textures (`BitmapTexture`, `ANoiseTexture`, `DirectTexture`).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateBitmapTexture**(`texture`): `ResourceStateBitmapTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L51)

Creates a ResourceStateBitmapTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`ANoiseTexture`](../../CoreNoiseTexture/classes/ANoiseTexture.md) \| [`DirectTexture`](../../../classes/DirectTexture.md) | Texture instance to manage |

#### Returns

`ResourceStateBitmapTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L31)

Resource cache key

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L26)

Texture source path

***

### texture

> **texture**: [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`ANoiseTexture`](../../CoreNoiseTexture/classes/ANoiseTexture.md) \| [`DirectTexture`](../../../classes/DirectTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L21)

Managed texture instance

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L36)

Resource reference count

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L41)

Unique identifier (UUID)
