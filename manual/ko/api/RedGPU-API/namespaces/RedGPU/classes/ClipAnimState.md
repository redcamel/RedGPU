[**RedGPU API v4.2.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / ClipAnimState

# Class: ClipAnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:27](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L27)

단일 glTF 클립을 래핑하는 애니메이션 상태 클래스입니다.

## Extends

- [`AnimState`](AnimState.md)

## Constructors

### Constructor

> **new ClipAnimState**(`name`, `clip`): `ClipAnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:30](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L30)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:28](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L28)

***

### enter()

> **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:35](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L35)

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

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:44](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L44)

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`exit`](AnimState.md#exit)

***

### update()

> **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:39](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L39)

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

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:9](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L9)

#### Inherited from

[`AnimState`](AnimState.md).[`name`](AnimState.md#name)

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:10](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/loader/gltf/animationLooper/AnimStateMachine.ts#L10)

#### Inherited from

[`AnimState`](AnimState.md).[`startTime`](AnimState.md#starttime)

## Methods


</details>
