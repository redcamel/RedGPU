[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimTransition

# Interface: AnimTransition

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L138)

애니메이션 상태 전이 규칙 인터페이스입니다.

## Properties

### conditions

> **conditions**: () => `boolean`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L158)

전이 시작 조건 판별 함수

#### Returns

`boolean`

***

### duration

> **duration**: `number`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L153)

크로스페이드 시간 (초 단위)

***

### fromState

> **fromState**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L143)

전이 출발 상태 이름

***

### toState

> **toState**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L148)

전이 도착 상태 이름
