[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / AnimState

# Abstract Class: AnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L15)

Abstract class that serves as the base for animation states.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extended by

- [`ClipAnimState`](ClipAnimState.md)

## Constructors

### Constructor

> **new AnimState**(`name`): `AnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L35)

Initializes an AnimState instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Animation state name |

#### Returns

`AnimState`

## Properties

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L20)

Animation state name

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L25)

State entry start time (ms)

## Methods

### enter()

> `abstract` **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L47)

Called when entering the state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp` | `number` | Entry timestamp (ms) |

#### Returns

`void`

***

### exit()

> `abstract` **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L66)

Called when exiting the state.

#### Returns

`void`

***

### update()

> `abstract` **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L60)

Called every frame while the state is active.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Elapsed time between frames (ms) |
| `timestamp` | `number` | Current frame timestamp (ms) |

#### Returns

`void`
