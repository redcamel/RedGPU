[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterControllerOptions

# Interface: SimpleCharacterControllerOptions

Defined in: [src/charactor/SimpleCharacterController.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L65)

Initialization options interface for `SimpleCharacterController`.

## Properties

### floorHeight?

> `optional` **floorHeight?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L95)

Base floor Y-axis height (default: `0.0`)

***

### floorOffset?

> `optional` **floorOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L120)

Additional vertical offset applied when grounded (default: `0.0`)

***

### getFloorHeight?

> `optional` **getFloorHeight?**: (`x`, `z`) => `number`

Defined in: [src/charactor/SimpleCharacterController.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L125)

Callback function returning the dynamic floor height at `(x, z)` coordinates

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

Defined in: [src/charactor/SimpleCharacterController.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L85)

Gravity acceleration (default: `9.8`)

***

### jumpForce?

> `optional` **jumpForce?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L90)

Initial jump velocity (default: `5.0`)

***

### keyMap?

> `optional` **keyMap?**: [`CharacterKeyMap`](CharacterKeyMap.md)

Defined in: [src/charactor/SimpleCharacterController.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L130)

Custom keyboard input mapping

***

### modelRotationOffset?

> `optional` **modelRotationOffset?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L105)

Default rotation offset angle of the 3D model in degrees (default: `0.0`)

***

### orientRotationToMovement?

> `optional` **orientRotationToMovement?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L115)

Whether to automatically orient character rotation toward the movement direction (default: `true`)

***

### rotationSpeed?

> `optional` **rotationSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L80)

Rotation interpolation speed (default: `8.0`)

***

### runSpeed?

> `optional` **runSpeed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L75)

Running movement speed (default: `speed * 2`)

***

### speed?

> `optional` **speed?**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L70)

Default movement speed (default: `5.0`)

***

### useControllerRotationYaw?

> `optional` **useControllerRotationYaw?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L110)

Whether to always align character rotation with camera yaw (default: `false`)

***

### useKeyboard?

> `optional` **useKeyboard?**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L100)

Whether keyboard control is enabled (default: `true`)
