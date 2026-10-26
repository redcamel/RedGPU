[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStateVertexBuffer

# Class: ResourceStateVertexBuffer

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L14)

`VertexBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ResourceStateVertexBuffer**(`buffer`): `ResourceStateVertexBuffer`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L40)

ResourceStateVertexBuffer 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffer` | [`VertexBuffer`](../../../classes/VertexBuffer.md) | 관리할 대상 `VertexBuffer` 인스턴스 |

#### Returns

`ResourceStateVertexBuffer`

## Properties

### buffer

> **buffer**: [`VertexBuffer`](../../../classes/VertexBuffer.md)

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L19)

관리 대상 정점 버퍼 인스턴스

***

### label

> **label**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L24)

버퍼 라벨 또는 이름

***

### uuid

> **uuid**: `string` \| `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L29)

고유 식별자(UUID)

## Accessors

### useNum

#### Get Signature

> **get** **useNum**(): `number`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L54)

리소스 참조 횟수를 반환하거나 설정합니다.

##### Returns

`number`

현재 참조 횟수

#### Set Signature

> **set** **useNum**(`value`): `void`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStateVertexBuffer.ts#L58)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
