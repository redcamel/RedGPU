[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateCubeTexture

# Class: ResourceStateCubeTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L15)

큐브 텍스처(`CubeTexture`, `DirectCubeTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateCubeTexture**(`cubeTexture`): `ResourceStateCubeTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L50)

ResourceStateCubeTexture 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cubeTexture` | [`CubeTexture`](../../../classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../classes/DirectCubeTexture.md) | 관리할 큐브 텍스처 인스턴스 |

#### Returns

`ResourceStateCubeTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L30)

리소스 캐시 키

***

### srcList

> **srcList**: `string`[]

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L25)

큐브맵 6면 소스 경로 배열

***

### texture

> **texture**: [`CubeTexture`](../../../classes/CubeTexture.md) \| [`DirectCubeTexture`](../../../classes/DirectCubeTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L20)

관리 대상 큐브 텍스처 인스턴스

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L35)

리소스 참조 횟수

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture.ts#L40)

고유 식별자(UUID)
