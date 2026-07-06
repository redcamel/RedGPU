[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:65](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L65)

State machine engine managing animation states and calculating interpolation weights.

## Constructors

### Constructor

> **new AnimStateMachine**(`initialState?`): `AnimStateMachine`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:73](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `initialState?` | [`AnimState`](AnimState.md) |

#### Returns

`AnimStateMachine`

## Properties

### currentState

> **currentState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:66](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L66)

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:67](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L67)

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:84](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L84)

Adds a new animation state.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`AnimState`](AnimState.md) |

#### Returns

`void`

***

### addTransition()

> **addTransition**(`transition`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:92](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L92)

Adds a transition condition.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `transition` | [`AnimTransition`](../interfaces/AnimTransition.md) |

#### Returns

`void`

***

### update()

> **update**(`deltaTime`, `timestamp`, `playInfo`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:100](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L100)

Updates the state machine every frame and controls blending weights.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |
| `timestamp` | `number` |
| `playInfo` | `PlayAnimationInfo` |

#### Returns

`void`
