[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierPhysics

# Class: RapierPhysics

Defined in: [src/plugins/rapier/RapierPhysics.ts:26](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L26)

**`Experimental`**


RedGPU physics plugin implementation using the Rapier physics engine.


This class integrates the WASM-based Rapier engine into the RedGPU environment and manages a high-performance physics simulation world. It provides core physics features such as rigid body creation, collision detection, character controllers, and gravity settings.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## See


 - [Physics Plugin Manual](https://redcamel.github.io/RedGPU/manual/en/plugins/physics)

## Implements

- [`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md)

## Constructors

### Constructor

> **new RapierPhysics**(): `RapierPhysics`

**`Experimental`**

#### Returns

`RapierPhysics`

## Properties

### onCollisionStarted()

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:42](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L42)

**`Experimental`**


Callback called when a collision starts in the physics engine.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | Handle of the first collider |
| `handle2` | `number` | Handle of the second collider |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`onCollisionStarted`](../../../../Physics/interfaces/IPhysicsEngine.md#oncollisionstarted)

## Accessors

### bodies

#### Get Signature

> **get** **bodies**(): [`RapierBody`](RapierBody.md)[]

Defined in: [src/plugins/rapier/RapierPhysics.ts:63](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L63)

**`Experimental`**


Returns a list of all RapierBody instances managed by the engine.

##### Returns

[`RapierBody`](RapierBody.md)[]

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`bodies`](../../../../Physics/interfaces/IPhysicsEngine.md#bodies)

***

### gravity

#### Get Signature

> **get** **gravity**(): `object`

Defined in: [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268)

**`Experimental`**


Sets or returns the gravity acceleration of the physics world.

* ### Example
```typescript

// Set gravity
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |
| `y` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |
| `z` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |

#### Set Signature

> **set** **gravity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:272](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L272)

**`Experimental`**


Sets or gets the gravity.

### Example
```typescript
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |
| `value.x` | `number` |
| `value.y` | `number` |
| `value.z` | `number` |

##### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`gravity`](../../../../Physics/interfaces/IPhysicsEngine.md#gravity)

***

### nativeWorld

#### Get Signature

> **get** **nativeWorld**(): `World`

Defined in: [src/plugins/rapier/RapierPhysics.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L49)

**`Experimental`**


Returns the native World object of the physics engine.

##### Returns

`World`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`nativeWorld`](../../../../Physics/interfaces/IPhysicsEngine.md#nativeworld)

***

### RAPIER

#### Get Signature

> **get** **RAPIER**(): `__module`

Defined in: [src/plugins/rapier/RapierPhysics.ts:56](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L56)

**`Experimental`**


Returns the Rapier library namespace.

##### Returns

`__module`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`RAPIER`](../../../../Physics/interfaces/IPhysicsEngine.md#rapier)

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:157](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L157)

**`Experimental`**


Creates a physics body for a specific mesh and registers it with the engine.

* ### Example
```typescript
const body = physicsEngine.createBody(mesh, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
    shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
    mass: 1.0
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | Target RedGPU mesh |
| `params` | [`BodyParams`](../../../../Physics/interfaces/BodyParams.md) | Parameters for body creation |

#### Returns

[`RapierBody`](RapierBody.md)


Created RapierBody instance

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createBody`](../../../../Physics/interfaces/IPhysicsEngine.md#createbody)

***

### createCharacterController()

> **createCharacterController**(`offset`): `KinematicCharacterController`

Defined in: [src/plugins/rapier/RapierPhysics.ts:292](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L292)

**`Experimental`**


Creates and returns a character controller.

* ### Example
```typescript
const controller = physicsEngine.createCharacterController(0.1);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | Offset between the character and the ground |

#### Returns

`KinematicCharacterController`


Rapier character controller instance

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createCharacterController`](../../../../Physics/interfaces/IPhysicsEngine.md#createcharactercontroller)

***

### getBodyByColliderHandle()

> **getBodyByColliderHandle**(`handle`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L81)

**`Experimental`**


Finds and returns the managed RapierBody using its collider handle.

* ### Example
```typescript
const body = physicsEngine.getBodyByColliderHandle(handle);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle` | `number` | Unique handle of the collider to find |

#### Returns

[`RapierBody`](RapierBody.md)


The found RapierBody (undefined if not found)

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/plugins/rapier/RapierPhysics.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L98)

**`Experimental`**


Initializes the Rapier engine and creates the physics world.

* ### Example
```typescript
await physicsEngine.init();
```

#### Returns

`Promise`\<`void`\>


Promise that guarantees initialization completion

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`init`](../../../../Physics/interfaces/IPhysicsEngine.md#init)

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:252](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L252)

**`Experimental`**


Removes a physics body from the engine.

* ### Example
```typescript

// Remove physics body
physicsEngine.removeBody(body);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`RapierBody`](RapierBody.md) | RapierBody instance to remove |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`removeBody`](../../../../Physics/interfaces/IPhysicsEngine.md#removebody)

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L121)

**`Experimental`**


Steps the physics simulation and synchronizes mesh transforms.

* ### Example
```typescript

// Step physics simulation in rendering loop
renderer.start(redGPUContext, (time, deltaTime) => {
    physicsEngine.step(deltaTime / 1000);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Time interval between frames (in seconds) |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`step`](../../../../Physics/interfaces/IPhysicsEngine.md#step)
