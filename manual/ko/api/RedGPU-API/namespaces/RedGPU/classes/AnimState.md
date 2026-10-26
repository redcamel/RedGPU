[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimState

# Abstract Class: AnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L15)

애니메이션 상태의 기본이 되는 추상 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extended by

- [`ClipAnimState`](ClipAnimState.md)

## Constructors

### Constructor

> **new AnimState**(`name`): `AnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L35)

AnimState 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 애니메이션 상태 이름 |

#### Returns

`AnimState`

## Properties

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L20)

애니메이션 상태 이름

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L25)

상태 진입 시작 시간 (ms)

## Methods

### enter()

> `abstract` **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L47)

상태에 진입할 때 호출됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp` | `number` | 진입 시점 타임스탬프 (ms) |

#### Returns

`void`

***

### exit()

> `abstract` **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L66)

상태에서 빠져나갈 때 호출됩니다.

#### Returns

`void`

***

### update()

> `abstract` **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L60)

상태가 활성화된 동안 매 프레임 호출됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 경과 시간 (ms) |
| `timestamp` | `number` | 현재 프레임 타임스탬프 (ms) |

#### Returns

`void`
