[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Charactor](../README.md) / SimpleCharacterController

# Class: SimpleCharacterController

Defined in: [src/charactor/SimpleCharacterController.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L154)

Controller class that handles keyboard-based movement, rotation interpolation, jumping, and gravity for a 3D character.

Supports both camera-relative and local-axis movement, and can synchronize with terrain height in real time via the `getFloorHeight` callback.

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

Defined in: [src/charactor/SimpleCharacterController.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L256)

Creates an instance of `SimpleCharacterController`.

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
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target character mesh to control |
| `camera` | [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md) | Camera instance used as the movement direction reference |
| `options?` | [`SimpleCharacterControllerOptions`](../interfaces/SimpleCharacterControllerOptions.md) | Character controller initialization options |

#### Returns

`SimpleCharacterController`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### floorHeight

> **floorHeight**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L184)

Base floor Y-axis height

***

***

### floorOffset

> **floorOffset**: `number` = `0.0`

Defined in: [src/charactor/SimpleCharacterController.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L189)

Additional vertical offset applied when grounded (default: `0.0`)

***

***

### getFloorHeight

> **getFloorHeight**: (`x`, `z`) => `number` = `null`

Defined in: [src/charactor/SimpleCharacterController.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L214)

Callback function returning the dynamic floor height at `(x, z)` coordinates

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

Defined in: [src/charactor/SimpleCharacterController.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L174)

Gravity acceleration

***

***

### jumpForce

> **jumpForce**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L179)

Initial jump velocity

***

***

### keyMap

> **keyMap**: `Required`\<[`CharacterKeyMap`](../interfaces/CharacterKeyMap.md)\>

Defined in: [src/charactor/SimpleCharacterController.ts:219](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L219)

Keyboard input mapping configuration object

***

***

### modelRotationOffset

> **modelRotationOffset**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:199](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L199)

Default rotation offset angle of the 3D model in degrees

***

***

### orientRotationToMovement

> **orientRotationToMovement**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L209)

Whether to automatically orient character rotation toward the movement direction

***

***

### rotationSpeed

> **rotationSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L169)

Rotation interpolation speed

***

***

### runSpeed

> **runSpeed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L164)

Running movement speed

***

***

### speed

> **speed**: `number`

Defined in: [src/charactor/SimpleCharacterController.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L159)

Default movement speed

***

***

### useControllerRotationYaw

> **useControllerRotationYaw**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L204)

Whether to always align character rotation with camera yaw

***

***

### useKeyboard

> **useKeyboard**: `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:194](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L194)

Whether keyboard control is enabled

## Accessors



***

### camera

#### Get Signature

> **get** **camera**(): [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

Defined in: [src/charactor/SimpleCharacterController.ts:322](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L322)

Returns or sets the reference camera for movement direction.

##### Returns

[`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)

Reference camera instance

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:326](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L326)

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

Defined in: [src/charactor/SimpleCharacterController.ts:363](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L363)

Returns whether the character is on the ground.

##### Returns

`boolean`

Whether grounded

***

***

### isMoving

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMoving**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:339](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L339)

Returns whether the character is currently moving.

##### Returns

`boolean`

Whether moving

***

***

### isRunning

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isRunning**(): `boolean`

Defined in: [src/charactor/SimpleCharacterController.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L351)

Returns whether the character is currently running.

##### Returns

`boolean`

Whether running

***

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/charactor/SimpleCharacterController.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L305)

Returns or sets the controlled target character mesh.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

Controlled target mesh

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/charactor/SimpleCharacterController.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L309)

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

Defined in: [src/charactor/SimpleCharacterController.ts:383](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/charactor/SimpleCharacterController.ts#L383)

Updates character movement, rotation, floor height synchronization, and gravity each frame.

#### Example
```typescript
controller.update(view, timestamp);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Currently rendering `View3D` instance |
| `time` | `number` | Current render loop timestamp in milliseconds |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
