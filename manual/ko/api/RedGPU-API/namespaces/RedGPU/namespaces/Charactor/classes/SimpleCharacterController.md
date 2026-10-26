[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterController

# Class: SimpleCharacterController

Defined in: [src/charactor/SimpleCharacterController.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L154)

3D 캐릭터의 키보드 기반 이동, 회전 보간, 점프 및 중력을 제어하는 컨트롤러 클래스입니다.

카메라 시점 기준 이동과 로컬 축 기준 이동을 모두 지원하며, `getFloorHeight` 콜백을 통해 지형 높이에 실시간으로 동기화할 수 있습니다.

***

### Example
```typescript
const controller = new RedGPU.Charactor.SimpleCharacterController(
    redGPUContext,
    characterMesh,
    view.camera,
    { speed: 5.0, runSpeed: 10.0, jumpForce: 5.0 }
);
```

## See

- [Keyboard Character Control example](https://redcamel.github.io/RedGPU/examples/gltf/animation/keyboardCharacterControl/)
 - [Lake Character Walking example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/characterWalking/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SimpleCharacterController**(`redGPUContext`, `targetMesh`, `camera`, `options?`): `SimpleCharacterController`

Defined in: [src/charactor/SimpleCharacterController.ts:256](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L256)

`SimpleCharacterController` 인스턴스를 생성합니다.

#### Example
```typescript
const controller = new RedGPU.Charactor.SimpleCharacterController(
    redGPUContext,
    characterMesh,
    view.camera,
    { speed: 5.0, jumpForce: 5.0 }
);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | 제어할 대상 캐릭터 메시 |
| `camera` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) | 이동 방향 기준이 되는 카메라 인스턴스 |
| `options?` | [`SimpleCharacterControllerOptions`](../interfaces/SimpleCharacterControllerOptions.md) | 캐릭터 컨트롤러 초기화 옵션 |

#### Returns

`SimpleCharacterController`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### floorHeight

> **floorHeight**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L184)

기준 바닥 Y축 높이

***

***

### floorOffset

> **floorOffset**: `number` = `0.0`

Defined in: [src/charactor/SimpleCharacterController.ts:189](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L189)

지면 안착 시 추가로 적용할 수직 오프셋 (기본값: `0.0`)

***

***

### getFloorHeight

> **getFloorHeight**: (`x`, `z`) => `number` = `null`

Defined in: [src/charactor/SimpleCharacterController.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L214)

특정 `(x, z)` 좌표의 동적 지면 높이를 반환하는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `z` | `number` |

#### Returns

`number`

***

***

### gravity

> **gravity**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L174)

중력 가속도

***

***

### jumpForce

> **jumpForce**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L179)

점프 초기 속도

***

***

### keyMap

> **keyMap**: `Required`\<[`CharacterKeyMap`](../interfaces/CharacterKeyMap.md)\>

Defined in: [src/charactor/SimpleCharacterController.ts:219](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L219)

키보드 입력 매핑 설정 객체

***

***

### modelRotationOffset

> **modelRotationOffset**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L199)

3D 모델의 기본 회전 오프셋 각도 (단위: 도)

***

***

### orientRotationToMovement

> **orientRotationToMovement**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L209)

이동 방향으로 캐릭터 회전을 자동 정렬할지 여부

***

***

### rotationSpeed

> **rotationSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:169](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L169)

회전 보간 속도

***

***

### runSpeed

> **runSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L164)

달리기 이동 속도

***

***

### speed

> **speed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L159)

기본 이동 속도

***

***

### useControllerRotationYaw

> **useControllerRotationYaw**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L204)

캐릭터 회전을 카메라 수평 방향(Yaw)에 항상 일치시킬지 여부

***

***

### useKeyboard

> **useKeyboard**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L194)

키보드 조작 활성화 여부

## Accessors



***

### camera

#### Get Signature

> **get** **camera**(): [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

Defined in: [src/charactor/SimpleCharacterController.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L322)

이동 방향 기준이 되는 카메라를 반환하거나 설정합니다.

##### Returns

[`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

기준 카메라 인스턴스

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:326](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) |

##### Returns

`void`

***

***

### isGrounded

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isGrounded**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L363)

캐릭터가 지면에 닿아 있는지 여부를 반환합니다.

##### Returns

`boolean`

지면 접지 여부

***

***

### isMoving

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMoving**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:339](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L339)

캐릭터가 현재 이동 중인지 여부를 반환합니다.

##### Returns

`boolean`

이동 중 여부

***

***

### isRunning

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isRunning**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L351)

캐릭터가 현재 달리기 중인지 여부를 반환합니다.

##### Returns

`boolean`

달리기 중 여부

***

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/charactor/SimpleCharacterController.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L305)

제어 중인 대상 캐릭터 메시를 반환하거나 설정합니다.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

제어 중인 대상 메시

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L309)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) |

##### Returns

`void`

***

## Methods



***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:383](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/charactor/SimpleCharacterController.ts#L383)

매 프레임 캐릭터의 이동, 회전, 지면 고도 동기화 및 중력을 갱신합니다.

#### Example
```typescript
controller.update(view, timestamp);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |
| `time` | `number` | 현재 렌더 루프 타임스탬프 (단위: ms) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
