[**RedGPU API v4.3.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimState

# Abstract Class: AnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:8](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L8)

Abstract class for animation states.

## Extended by

- [`ClipAnimState`](ClipAnimState.md)

## Constructors

### Constructor

> **new AnimState**(`name`): `AnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:12](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L12)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`AnimState`

## Properties

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:9](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L9)

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:10](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L10)

## Methods

### enter()

> `abstract` **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:16](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `timestamp` | `number` |

#### Returns

`void`

***

### exit()

> `abstract` **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:20](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L20)

#### Returns

`void`

***

### update()

> `abstract` **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:18](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/loader/gltf/animationLooper/AnimStateMachine.ts#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |
| `timestamp` | `number` |

#### Returns

`void`
