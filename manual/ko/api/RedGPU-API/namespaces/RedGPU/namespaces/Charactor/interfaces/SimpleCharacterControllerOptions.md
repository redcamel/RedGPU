[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterControllerOptions

# Interface: SimpleCharacterControllerOptions

Defined in: [src/charactor/SimpleCharacterController.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L65)

`SimpleCharacterController`의 초기화 옵션 인터페이스입니다.

## Properties

### floorHeight?

> `optional` **floorHeight?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:95](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L95)

기준 바닥 Y축 높이 (기본값: `0.0`)

***

### floorOffset?

> `optional` **floorOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L120)

지면 안착 시 추가로 적용할 수직 오프셋 (기본값: `0.0`)

***

### getFloorHeight?

> `optional` **getFloorHeight?**: (`x`, `z`) => `number`

Defined in: [src/charactor/SimpleCharacterController.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L125)

특정 `(x, z)` 좌표의 동적 지면 높이를 반환하는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `z` | `number` |

#### Returns

`number`

***

### gravity?

> `optional` **gravity?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L85)

중력 가속도 (기본값: `9.8`)

***

### jumpForce?

> `optional` **jumpForce?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L90)

점프 초기 속도 (기본값: `5.0`)

***

### keyMap?

> `optional` **keyMap?**: [`CharacterKeyMap`](CharacterKeyMap.md)

Defined in: [src/charactor/SimpleCharacterController.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L130)

사용자 정의 키보드 입력 매핑

***

### modelRotationOffset?

> `optional` **modelRotationOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L105)

3D 모델의 기본 회전 오프셋 각도 (단위: 도, 기본값: `0.0`)

***

### orientRotationToMovement?

> `optional` **orientRotationToMovement?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L115)

이동 방향으로 캐릭터 회전을 자동 정렬할지 여부 (기본값: `true`)

***

### rotationSpeed?

> `optional` **rotationSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L80)

회전 보간 속도 (기본값: `8.0`)

***

### runSpeed?

> `optional` **runSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L75)

달리기 이동 속도 (기본값: `speed * 2`)

***

### speed?

> `optional` **speed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L70)

기본 이동 속도 (기본값: `5.0`)

***

### useControllerRotationYaw?

> `optional` **useControllerRotationYaw?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L110)

캐릭터 회전을 카메라 수평 방향(Yaw)에 항상 일치시킬지 여부 (기본값: `false`)

***

### useKeyboard?

> `optional` **useKeyboard?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L100)

키보드 조작 활성화 여부 (기본값: `true`)
