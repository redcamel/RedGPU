[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterController

# Class: SimpleCharacterController

Defined in: [src/charactor/SimpleCharacterController.ts:63](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L63)

3D 캐릭터의 움직임과 회전을 제어하는 Simple 캐릭터 컨트롤러 클래스입니다.

카메라 뷰 방향과 독립된 이동(WASD) 및 자연스러운 선회 회전, 그리고 점프 및 낙하 중력을 단독으로 구현합니다.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SimpleCharacterController**(`redGPUContext`, `targetMesh`, `camera`, `options?`): `SimpleCharacterController`

Defined in: [src/charactor/SimpleCharacterController.ts:97](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L97)

SimpleCharacterController 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | 제어할 캐릭터 메시
| `camera` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) | 카메라 인스턴스
| `options` | [`SimpleCharacterControllerOptions`](../interfaces/SimpleCharacterControllerOptions.md) | 캐릭터 설정 옵션

#### Returns

`SimpleCharacterController`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### floorHeight

> **floorHeight**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L70)

***

### gravity

> **gravity**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:68](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L68)

***

### jumpForce

> **jumpForce**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:69](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L69)

***

### keyMap

> **keyMap**: `Required`\<[`CharacterKeyMap`](../interfaces/CharacterKeyMap.md)\>

Defined in: [src/charactor/SimpleCharacterController.ts:75](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L75)

***

### modelRotationOffset

> **modelRotationOffset**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:72](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L72)

***

### orientRotationToMovement

> **orientRotationToMovement**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:74](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L74)

***

### rotationSpeed

> **rotationSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:67](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L67)

***

### runSpeed

> **runSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:66](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L66)

***

### speed

> **speed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:65](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L65)

***

### useControllerRotationYaw

> **useControllerRotationYaw**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:73](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L73)

***

### useKeyboard

> **useKeyboard**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:71](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L71)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

Defined in: [src/charactor/SimpleCharacterController.ts:151](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L151)

방향 기준 카메라를 반환합니다.

##### Returns

[`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:156](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L156)

방향 기준 카메라를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) |

##### Returns

`void`

***

### isGrounded

#### Get Signature

> **get** **isGrounded**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:172](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L172)

지면에 닿아있는지 여부를 반환합니다.

##### Returns

`boolean`

***

### isMoving

#### Get Signature

> **get** **isMoving**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:162](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L162)

캐릭터가 현재 이동(WASD 입력) 중인지 여부를 반환합니다.

##### Returns

`boolean`

***

### isRunning

#### Get Signature

> **get** **isRunning**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:167](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L167)

캐릭터가 현재 달리기(Shift 조합 입력) 중인지 여부를 반환합니다.

##### Returns

`boolean`

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/charactor/SimpleCharacterController.ts:140](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L140)

제어 중인 대상 메시를 반환합니다.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:145](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L145)

제어 중인 대상 메시를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) |

##### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:185](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/charactor/SimpleCharacterController.ts#L185)

매 프레임 업데이트 루프를 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 View3D 인스턴스
| `time` | `number` | 현재 렌더 타임스탬프 (ms)

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
