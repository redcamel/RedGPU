[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / ClipAnimState

# Class: ClipAnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:27](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L27)

Animation state class wrapping a single glTF clip.

## Extends

- [`AnimState`](AnimState.md)

## Constructors

### Constructor

> **new ClipAnimState**(`name`, `clip`): `ClipAnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:30](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `clip` | `GLTFParsedSingleClip` |

#### Returns

`ClipAnimState`

#### Overrides

[`AnimState`](AnimState.md).[`constructor`](AnimState.md#constructor)

## Properties

### clip

> **clip**: `GLTFParsedSingleClip`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:28](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L28)

***

### enter()

> **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:35](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `timestamp` | `number` |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`enter`](AnimState.md#enter)

***

### exit()

> **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:44](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L44)

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`exit`](AnimState.md#exit)

***

### update()

> **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:39](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |
| `timestamp` | `number` |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`update`](AnimState.md#update)


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:9](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L9)

#### Inherited from

[`AnimState`](AnimState.md).[`name`](AnimState.md#name)

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:10](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/loader/gltf/animationLooper/AnimStateMachine.ts#L10)

#### Inherited from

[`AnimState`](AnimState.md).[`startTime`](AnimState.md#starttime)

## Methods


</details>
