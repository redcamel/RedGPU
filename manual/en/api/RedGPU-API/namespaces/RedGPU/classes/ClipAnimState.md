[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / ClipAnimState

# Class: ClipAnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L75)

Animation state class wrapping a single glTF animation clip.

## Extends

- [`AnimState`](AnimState.md)

## Constructors



***

### Constructor

> **new ClipAnimState**(`name`, `clip`): `ClipAnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L93)

Creates a ClipAnimState instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | State name |
| `clip` | `GLTFParsedSingleClip` | Parsed single glTF animation clip |

#### Returns

`ClipAnimState`

#### Overrides

[`AnimState`](AnimState.md).[`constructor`](AnimState.md#constructor)

## Properties



***

### clip

> **clip**: `GLTFParsedSingleClip`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L80)

Parsed single glTF animation clip

***

## Methods



***

### enter()

> **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L106)

Records the start timestamp when entering the state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp` | `number` | Entry timestamp (ms) |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`enter`](AnimState.md#enter)

***

***

### exit()

> **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L128)

Called when the state is deactivated.

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`exit`](AnimState.md#exit)

***

***

### update()

> **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L121)

Updates the single animation state per frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Elapsed time between frames (ms) |
| `timestamp` | `number` | Current frame timestamp (ms) |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`update`](AnimState.md#update)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L20)

Animation state name

#### Inherited from

[`AnimState`](AnimState.md).[`name`](AnimState.md#name)

***

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/animationLooper/AnimStateMachine.ts#L25)

State entry start time (ms)

#### Inherited from

[`AnimState`](AnimState.md).[`startTime`](AnimState.md#starttime)

</details>
