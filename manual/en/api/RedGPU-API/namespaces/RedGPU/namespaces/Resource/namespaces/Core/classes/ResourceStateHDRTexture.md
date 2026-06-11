[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateHDRTexture

# Class: ResourceStateHDRTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:7](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L7)

A class that defines the managed state of HDR-related textures (2D).

## Constructors

### Constructor

> **new ResourceStateHDRTexture**(`texture`): `ResourceStateHDRTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:19](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`HDRTexture`](../../../classes/HDRTexture.md) |

#### Returns

`ResourceStateHDRTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:13](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L13)

Cache key

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:11](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L11)

Source path

***

### texture

> **texture**: [`HDRTexture`](../../../classes/HDRTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:9](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L9)

Managed texture instance

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:15](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L15)

Reference count

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:17](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L17)

Unique ID
