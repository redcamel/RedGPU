[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateHDRTexture

# Class: ResourceStateHDRTexture

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:7](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L7)

HDR 관련 텍스처(2D)의 관리 상태를 정의하는 클래스입니다.

## Constructors

### Constructor

> **new ResourceStateHDRTexture**(`texture`): `ResourceStateHDRTexture`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:19](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`HDRTexture`](../../../classes/HDRTexture.md) |

#### Returns

`ResourceStateHDRTexture`

## Properties

### cacheKey

> **cacheKey**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:13](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L13)

캐시 키

***

### src

> **src**: `string`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:11](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L11)

소스 경로

***

### texture

> **texture**: [`HDRTexture`](../../../classes/HDRTexture.md)

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:9](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L9)

관리 대상 텍스처 인스턴스

***

### useNum

> **useNum**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:15](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L15)

참조 횟수

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts:17](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture.ts#L17)

고유 ID
