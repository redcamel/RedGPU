[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateStorageBuffer

# Class: ResourceStateStorageBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L14)

`StorageBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateStorageBuffer**(`buffer`): `ResourceStateStorageBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L35)

ResourceStateStorageBuffer 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`StorageBuffer`](../../../classes/StorageBuffer.md) | 관리할 대상 `StorageBuffer` 인스턴스 |

#### Returns

`ResourceStateStorageBuffer`

## Properties

### buffer

> **buffer**: [`StorageBuffer`](../../../classes/StorageBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L19)

관리 대상 스토리지 버퍼 인스턴스

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L24)

고유 식별자(UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L48)

리소스 참조 횟수를 반환하거나 설정합니다.

##### Returns

`number`

현재 참조 횟수

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/resourceManager/resourceState/ResourceStateStorageBuffer.ts#L52)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
