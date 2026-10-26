[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStatusInfo

# Class: ResourceStatusInfo

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L12)

리소스 카테고리별 캐시 테이블과 비디오 메모리 사용량을 관리하는 상태 정보 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStatusInfo**(): `ResourceStatusInfo`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L28)

ResourceStatusInfo 인스턴스를 생성합니다.

#### Returns

`ResourceStatusInfo`

## Properties

### table

> **table**: `Map`\<`string`, `any`\>

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L17)

캐시 키별 리소스 상태를 저장하는 맵 (`Map<string, any>`)

***

### videoMemory

> **videoMemory**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L22)

해당 리소스 카테고리의 총 비디오 메모리 사용량(바이트)
