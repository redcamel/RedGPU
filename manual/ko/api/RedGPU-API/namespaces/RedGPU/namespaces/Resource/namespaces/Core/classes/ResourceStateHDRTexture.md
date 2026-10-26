[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateHDRTexture

# Class: ResourceStateHDRTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L14)

HDR 텍스처(`HDRTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateHDRTexture**(`texture`): `ResourceStateHDRTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L49)

ResourceStateHDRTexture 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`HDRTexture`](../../../classes/HDRTexture.md) | 관리할 HDR 텍스처 인스턴스 |

#### Returns

`ResourceStateHDRTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L29)

리소스 캐시 키

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L24)

텍스처 소스 경로

***

### texture

> **texture**: [`HDRTexture`](../../../classes/HDRTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L19)

관리 대상 HDR 텍스처 인스턴스

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L34)

리소스 참조 횟수

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L39)

고유 식별자(UUID)
