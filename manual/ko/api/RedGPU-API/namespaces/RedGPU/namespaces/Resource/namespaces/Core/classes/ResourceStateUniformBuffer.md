[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateUniformBuffer

# Class: ResourceStateUniformBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L14)

`UniformBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateUniformBuffer**(`buffer`): `ResourceStateUniformBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L35)

ResourceStateUniformBuffer 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`UniformBuffer`](../../../classes/UniformBuffer.md) | 관리할 대상 `UniformBuffer` 인스턴스 |

#### Returns

`ResourceStateUniformBuffer`

## Properties

### buffer

> **buffer**: [`UniformBuffer`](../../../classes/UniformBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L19)

관리 대상 유니폼 버퍼 인스턴스

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L24)

고유 식별자(UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L48)

리소스 참조 횟수를 반환하거나 설정합니다.

##### Returns

`number`

현재 참조 횟수

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateUniformBuffer.ts#L52)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
