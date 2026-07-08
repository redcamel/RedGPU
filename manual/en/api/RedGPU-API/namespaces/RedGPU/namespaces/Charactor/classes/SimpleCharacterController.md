[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterController

# Class: SimpleCharacterController

Defined in: [src/charactor/SimpleCharacterController.ts:63](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L63)

Simple character controller class that controls the movement and rotation of a 3D character.

Implements camera-independent movement (WASD), smooth rotation interpolation, and jump/fall gravity independently.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SimpleCharacterController**(`redGPUContext`, `targetMesh`, `camera`, `options?`): `SimpleCharacterController`

Defined in: [src/charactor/SimpleCharacterController.ts:97](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L97)

Creates an instance of SimpleCharacterController.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | Character mesh to control |
| `camera` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) | Camera instance |
| `options` | [`SimpleCharacterControllerOptions`](../interfaces/SimpleCharacterControllerOptions.md) | Character settings options |

#### Returns

`SimpleCharacterController`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### floorHeight

> **floorHeight**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:70](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L70)

***

### gravity

> **gravity**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:68](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L68)

***

### jumpForce

> **jumpForce**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:69](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L69)

***

### keyMap

> **keyMap**: `Required`\<[`CharacterKeyMap`](../interfaces/CharacterKeyMap.md)\>

Defined in: [src/charactor/SimpleCharacterController.ts:75](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L75)

***

### modelRotationOffset

> **modelRotationOffset**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:72](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L72)

***

### orientRotationToMovement

> **orientRotationToMovement**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:74](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L74)

***

### rotationSpeed

> **rotationSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:67](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L67)

***

### runSpeed

> **runSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:66](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L66)

***

### speed

> **speed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:65](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L65)

***

### useControllerRotationYaw

> **useControllerRotationYaw**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:73](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L73)

***

### useKeyboard

> **useKeyboard**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:71](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L71)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

Defined in: [src/charactor/SimpleCharacterController.ts:151](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L151)

Returns the reference camera.

##### Returns

[`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:156](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L156)

Sets the reference camera.

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

Defined in: [src/charactor/SimpleCharacterController.ts:172](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L172)

Returns whether the character is on the ground.

##### Returns

`boolean`

***

### isMoving

#### Get Signature

> **get** **isMoving**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:162](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L162)

Returns whether the character is currently moving.

##### Returns

`boolean`

***

### isRunning

#### Get Signature

> **get** **isRunning**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:167](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L167)

Returns whether the character is currently running.

##### Returns

`boolean`

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/charactor/SimpleCharacterController.ts:140](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L140)

Returns the controlled target mesh.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:145](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L145)

Sets the controlled target mesh.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) |

##### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:185](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/charactor/SimpleCharacterController.ts#L185)

Performs the update loop per frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Current View3D instance |
| `time` | `number` | Current render timestamp (ms) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
