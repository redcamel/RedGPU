[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / ClipAnimState

# Class: ClipAnimState

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L75)

단일 glTF 애니메이션 클립을 래핑하는 애니메이션 상태 클래스입니다.

## Extends

- [`AnimState`](AnimState.md)

## Constructors



***

### Constructor

> **new ClipAnimState**(`name`, `clip`): `ClipAnimState`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L93)

ClipAnimState 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 상태 이름 |
| `clip` | `GLTFParsedSingleClip` | 파싱된 단일 glTF 애니메이션 클립 |

#### Returns

`ClipAnimState`

#### Overrides

[`AnimState`](AnimState.md).[`constructor`](AnimState.md#constructor)

## Properties



***

### clip

> **clip**: `GLTFParsedSingleClip`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L80)

파싱된 단일 glTF 애니메이션 클립

***

## Methods



***

### enter()

> **enter**(`timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L106)

상태 진입 시 시작 타임스탬프를 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp` | `number` | 진입 시점 타임스탬프 (ms) |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`enter`](AnimState.md#enter)

***

***

### exit()

> **exit**(): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L128)

상태가 해제될 때 호출됩니다.

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`exit`](AnimState.md#exit)

***

***

### update()

> **update**(`deltaTime`, `timestamp`): `void`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L121)

단일 애니메이션 상태를 프레임 단위로 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 경과 시간 (ms) |
| `timestamp` | `number` | 현재 프레임 타임스탬프 (ms) |

#### Returns

`void`

#### Overrides

[`AnimState`](AnimState.md).[`update`](AnimState.md#update)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### name

> **name**: `string`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L20)

애니메이션 상태 이름

#### Inherited from

[`AnimState`](AnimState.md).[`name`](AnimState.md#name)

***

***

### startTime

> **startTime**: `number` = `0`

Defined in: [src/loader/gltf/animationLooper/AnimStateMachine.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/animationLooper/AnimStateMachine.ts#L25)

상태 진입 시작 시간 (ms)

#### Inherited from

[`AnimState`](AnimState.md).[`startTime`](AnimState.md#starttime)

</details>
