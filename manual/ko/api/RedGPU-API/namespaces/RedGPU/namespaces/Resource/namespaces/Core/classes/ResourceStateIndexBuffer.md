[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateIndexBuffer

# Class: ResourceStateIndexBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L14)

`IndexBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateIndexBuffer**(`buffer`): `ResourceStateIndexBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L40)

ResourceStateIndexBuffer 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`IndexBuffer`](../../../classes/IndexBuffer.md) | 관리할 대상 `IndexBuffer` 인스턴스 |

#### Returns

`ResourceStateIndexBuffer`

## Properties

### buffer

> **buffer**: [`IndexBuffer`](../../../classes/IndexBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L19)

관리 대상 인덱스 버퍼 인스턴스

***

### label

> **label**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L24)

버퍼 라벨 또는 이름

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L29)

고유 식별자(UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L54)

리소스 참조 횟수를 반환하거나 설정합니다.

##### Returns

`number`

현재 참조 횟수

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateIndexBuffer.ts#L58)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
