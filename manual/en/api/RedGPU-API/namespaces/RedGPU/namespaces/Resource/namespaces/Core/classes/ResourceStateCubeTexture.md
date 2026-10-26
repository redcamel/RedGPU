[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateCubeTexture

# Class: ResourceStateCubeTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L15)

Class representing the resource management state of cube textures (`CubeTexture`, `DirectCubeTexture`).

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStateCubeTexture**(`cubeTexture`): `ResourceStateCubeTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L50)

Creates a ResourceStateCubeTexture instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | [`CubeTexture`](../../../classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../classes/DirectCubeTexture.md) | Cube texture instance to manage |

#### Returns

`ResourceStateCubeTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L30)

Resource cache key

***

### srcList

> **srcList**: `string`[]

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L25)

Array of source paths for the 6 cubemap faces

***

### texture

> **texture**: [`CubeTexture`](../../../classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../classes/DirectCubeTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L20)

Managed cube texture instance

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L35)

Resource reference count

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L40)

Unique identifier (UUID)
