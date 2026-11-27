[**RedGPU API v4.6.0**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:183](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L183)

State machine class that manages animation state transitions and crossfade blending weights.

### Example
```typescript
// Register states and add transition rules
const stateMachine = new RedGPU.GLTFLoader.AnimStateMachine(idleState);
stateMachine.addState(runState);
stateMachine.addTransition({
    fromState: 'Idle',
    toState: 'Run',
    duration: 0.3,
    conditions: () => isRunning
});
```

## See

 - [Motion Blending example](https://redcamel.github.io/RedGPU/examples/gltf/animation/motionBlending/)
 - [Keyboard Character Control example](https://redcamel.github.io/RedGPU/examples/gltf/animation/keyboardCharacterControl/)

## Constructors

### Constructor

> **new AnimStateMachine**(`initialState?`): `AnimStateMachine`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:207](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L207)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:188](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L188)

Currently active animation state

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:193](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L193)

Target animation state for transition

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:222](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L222)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:234](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L234)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:252](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L252)

Updates the state machine every frame and calculates motion blending weights.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Elapsed time between frames (ms) |
| `timestamp` | `number` | Current frame timestamp (ms) |
| `playInfo` | `PlayAnimationInfo` | Animation playback info object to update |

#### Returns

`void`
