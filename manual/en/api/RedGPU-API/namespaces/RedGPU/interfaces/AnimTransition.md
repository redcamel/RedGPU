[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimTransition

# Interface: AnimTransition

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L138)

Interface for animation state transition rules.

## Properties

### conditions

> **conditions**: () => `boolean`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L158)

Condition predicate function for starting transition

#### Returns

`boolean`

***

### duration

> **duration**: `number`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L153)

Crossfade duration in seconds

***

### fromState

> **fromState**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L143)

Source state name for transition

***

### toState

> **toState**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L148)

Target state name for transition
