[**RedGPU API v4.6.0**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:183](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L183)

애니메이션 상태 전이와 크로스페이드 블렌딩 가중치를 관리하는 상태 머신 클래스입니다.

### Example
```typescript
// 상태 등록 및 전이 규칙 추가
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

AnimStateMachine 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initialState?` | [`AnimState`](AnimState.md) | 초기 애니메이션 상태 (선택) |

#### Returns

`AnimStateMachine`

## Properties

### currentState

> **currentState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:188](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L188)

현재 활성 애니메이션 상태

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:193](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L193)

전이 목표 애니메이션 상태

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:222](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L222)

새로운 애니메이션 상태를 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `state` | [`AnimState`](AnimState.md) | 추가할 애니메이션 상태 인스턴스 |

#### Returns

`void`

***

### addTransition()

> **addTransition**(`transition`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:234](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L234)

상태 전이 규칙을 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `transition` | [`AnimTransition`](../interfaces/AnimTransition.md) | 추가할 전이 규칙 객체 |

#### Returns

`void`

***

### update()

> **update**(`deltaTime`, `timestamp`, `playInfo`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:252](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/animationLooper/AnimStateMachine.ts#L252)

매 프레임 상태 머신을 갱신하고 모션 블렌딩 가중치를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 경과 시간 (ms) |
| `timestamp` | `number` | 현재 프레임 타임스탬프 (ms) |
| `playInfo` | `PlayAnimationInfo` | 갱신할 애니메이션 재생 정보 객체 |

#### Returns

`void`
