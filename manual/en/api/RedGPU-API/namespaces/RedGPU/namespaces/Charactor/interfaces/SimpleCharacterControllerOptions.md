[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterControllerOptions

# Interface: SimpleCharacterControllerOptions

Defined in: [src/charactor/SimpleCharacterController.ts:29](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L29)

Initialization options interface for SimpleCharacterController.

## Properties

### floorHeight?

> `optional` **floorHeight?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:41](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L41)

Floor Y-axis height (default: 0.0)

***

### gravity?

> `optional` **gravity?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:37](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L37)

Gravity acceleration (default: 9.8)

***

### jumpForce?

> `optional` **jumpForce?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:39](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L39)

Jump force (default: 5.0)

***

### keyMap?

> `optional` **keyMap?**: [`CharacterKeyMap`](CharacterKeyMap.md)

Defined in: [src/charactor/SimpleCharacterController.ts:51](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L51)

Custom keyboard mapping configuration

***

### modelRotationOffset?

> `optional` **modelRotationOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:45](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L45)

Model's default rotation offset angle (in degrees, default: 0.0)

***

### orientRotationToMovement?

> `optional` **orientRotationToMovement?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:49](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L49)

Whether to orient character rotation to movement direction (default: true)

***

### rotationSpeed?

> `optional` **rotationSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:35](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L35)

Rotation interpolation speed (default: 8.0)

***

### runSpeed?

> `optional` **runSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:33](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L33)

Run speed (default: 10.0)

***

### speed?

> `optional` **speed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:31](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L31)

Movement speed (default: 5.0)

***

### useControllerRotationYaw?

> `optional` **useControllerRotationYaw?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:47](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L47)

Whether to use controller rotation yaw (whether the character always aligns with camera direction, default: false)

***

### useKeyboard?

> `optional` **useKeyboard?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:43](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/charactor/SimpleCharacterController.ts#L43)

Whether to enable keyboard control (default: true)
