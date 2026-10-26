[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateHDRTexture

# Class: ResourceStateHDRTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L14)

Class representing the resource management state of HDR textures (`HDRTexture`).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateHDRTexture**(`texture`): `ResourceStateHDRTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L49)

Creates a ResourceStateHDRTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`HDRTexture`](../../../classes/HDRTexture.md) | HDR texture instance to manage |

#### Returns

`ResourceStateHDRTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L29)

Resource cache key

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L24)

Texture source path

***

### texture

> **texture**: [`HDRTexture`](../../../classes/HDRTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L19)

Managed HDR texture instance

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L34)

Resource reference count

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L39)

Unique identifier (UUID)
