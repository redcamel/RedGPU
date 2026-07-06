[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterControllerOptions

# Interface: SimpleCharacterControllerOptions

Defined in: [src/charactor/SimpleCharacterController.ts:29](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L29)

Simple 캐릭터 컨트롤러의 초기화 옵션 인터페이스입니다.

## Properties

### floorHeight?

> `optional` **floorHeight?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:41](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L41)

바닥 Y축 높이 (기본값: 0.0)

***

### gravity?

> `optional` **gravity?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:37](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L37)

중력 가속도 (기본값: 9.8)

***

### jumpForce?

> `optional` **jumpForce?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:39](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L39)

점프 힘 (기본값: 5.0)

***

### keyMap?

> `optional` **keyMap?**: [`CharacterKeyMap`](CharacterKeyMap.md)

Defined in: [src/charactor/SimpleCharacterController.ts:51](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L51)

사용자 정의 키보드 매핑

***

### modelRotationOffset?

> `optional` **modelRotationOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:45](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L45)

모델 자체의 기본 회전 오프셋 각도 (도 단위, 기본값: 0.0)

***

### orientRotationToMovement?

> `optional` **orientRotationToMovement?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:49](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L49)

이동 방향으로 캐릭터 회전 정렬 여부 (기본값: true)

***

### rotationSpeed?

> `optional` **rotationSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L35)

회전 보간 속도 (기본값: 8.0)

***

### runSpeed?

> `optional` **runSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:33](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L33)

달리기 속도 (기본값: 10.0)

***

### speed?

> `optional` **speed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:31](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L31)

이동 속도 (기본값: 5.0)

***

### useControllerRotationYaw?

> `optional` **useControllerRotationYaw?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:47](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L47)

컨트롤러 회전 사용 여부 (캐릭터가 카메라 방향을 항상 유지할지 여부, 기본값: false)

***

### useKeyboard?

> `optional` **useKeyboard?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:43](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/charactor/SimpleCharacterController.ts#L43)

키보드 조작 활성화 여부 (기본값: true)
