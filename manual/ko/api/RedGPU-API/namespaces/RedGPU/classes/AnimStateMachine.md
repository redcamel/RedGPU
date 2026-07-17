[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:65](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L65)

애니메이션 상태를 관리하고 보간 가중치를 산출하는 상태 머신 엔진입니다.

## Constructors

### Constructor

> **new AnimStateMachine**(`initialState?`): `AnimStateMachine`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:73](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `initialState?` | [`AnimState`](AnimState.md) |

#### Returns

`AnimStateMachine`

## Properties

### currentState

> **currentState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:66](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L66)

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:67](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L67)

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:84](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L84)

새로운 애니메이션 상태를 추가합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`AnimState`](AnimState.md) |

#### Returns

`void`

***

### addTransition()

> **addTransition**(`transition`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:92](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L92)

상태 전이 조건을 추가합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `transition` | [`AnimTransition`](../interfaces/AnimTransition.md) |

#### Returns

`void`

***

### update()

> **update**(`deltaTime`, `timestamp`, `playInfo`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:100](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/loader/gltf/animationLooper/AnimStateMachine.ts#L100)

매 프레임 상태 머신을 업데이트하고 블렌딩 가중치를 제어합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |
| `timestamp` | `number` |
| `playInfo` | `PlayAnimationInfo` |

#### Returns

`void`
