[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateBitmapTexture

# Class: ResourceStateBitmapTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L16)

2D 비트맵 텍스처(`BitmapTexture`, `ANoiseTexture`, `DirectTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateBitmapTexture**(`texture`): `ResourceStateBitmapTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L51)

ResourceStateBitmapTexture 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`ANoiseTexture`](../../CoreNoiseTexture/classes/ANoiseTexture.md) \| [`DirectTexture`](../../../classes/DirectTexture.md) | 관리할 텍스처 인스턴스 |

#### Returns

`ResourceStateBitmapTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L31)

리소스 캐시 키

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L26)

텍스처 소스 경로

***

### texture

> **texture**: [`BitmapTexture`](../../../classes/BitmapTexture.md) \| [`ANoiseTexture`](../../CoreNoiseTexture/classes/ANoiseTexture.md) \| [`DirectTexture`](../../../classes/DirectTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L21)

관리 대상 텍스처 인스턴스

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L36)

리소스 참조 횟수

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture.ts#L41)

고유 식별자(UUID)
