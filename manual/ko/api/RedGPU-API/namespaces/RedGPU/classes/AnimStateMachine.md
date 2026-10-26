[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimStateMachine

# Class: AnimStateMachine

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L167)

애니메이션 상태 전이와 블렌딩 가중치를 관리하는 상태 머신 클래스입니다.

## Constructors

### Constructor

> **new AnimStateMachine**(`initialState?`): `AnimStateMachine`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L191)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L172)

현재 활성 애니메이션 상태

***

### targetState

> **targetState**: [`AnimState`](AnimState.md) = `null`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L177)

전이 목표 애니메이션 상태

## Methods

### addState()

> **addState**(`state`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:206](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L206)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L218)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L236)

매 프레임 상태 머신을 갱신하고 모션 블렌딩 가중치를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 경과 시간 (ms) |
| `timestamp` | `number` | 현재 프레임 타임스탬프 (ms) |
| `playInfo` | `PlayAnimationInfo` | 갱신할 애니메이션 재생 정보 객체 |

#### Returns

`void`
