[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L167)

State machine class that manages animation state transitions and blending weights.

## Constructors

### Constructor

> **new AnimStateMachine**(`initialState?`): `AnimStateMachine`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L191)

Creates an AnimStateMachine instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initialState?` | [`AnimState`](AnimState.md) | Initial animation state (optional) |

#### Returns

`AnimStateMachine`

## Properties

### currentState

> **currentState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L172)

Currently active animation state

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L177)

Target animation state for transition

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:206](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L206)

Registers a new animation state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `state` | [`AnimState`](AnimState.md) | Animation state instance to add |

#### Returns

`void`

***

### addTransition()

> **addTransition**(`transition`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L218)

Adds a state transition rule.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `transition` | [`AnimTransition`](../interfaces/AnimTransition.md) | Transition rule object to add |

#### Returns

`void`

***

### update()

> **update**(`deltaTime`, `timestamp`, `playInfo`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L236)

Updates the state machine every frame and calculates motion blending weights.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Elapsed time between frames (ms) |
| `timestamp` | `number` | Current frame timestamp (ms) |
| `playInfo` | `PlayAnimationInfo` | Animation playback info object to update |

#### Returns

`void`
