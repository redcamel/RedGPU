[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierPhysics

# Class: RapierPhysics

Defined in: [src/plugins/rapier/RapierPhysics.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L25)

**`Experimental`**

RedGPU physics plugin implementation using the Rapier physics engine.

Integrates the WASM-based Rapier engine to manage the physics simulation world, including rigid body creation, collision detection, character controllers, and gravity settings.

::: warning
This feature is currently in the experimental stage. The API may change in the future.
:::

## See

[Basic Physics example](https://redcamel.github.io/RedGPU/examples/physics/basic/)

## Implements

- [`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md)

## Constructors

### Constructor

> **new RapierPhysics**(): `RapierPhysics`

**`Experimental`**

#### Returns

`RapierPhysics`

## Properties

### onCollisionStarted

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L37)

**`Experimental`**

Callback function invoked when a collision starts in the physics engine.

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

> <span class="readonly-badge">readonly</span> **get** **bodies**(): [`RapierBody`](RapierBody.md)[]

Defined in: [src/plugins/rapier/RapierPhysics.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L74)

**`Experimental`**

Returns a list of all `RapierBody` instances managed by the engine.

##### Returns

[`RapierBody`](RapierBody.md)[]

Array of `RapierBody` instances

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`bodies`](../../../../Physics/interfaces/IPhysicsEngine.md#bodies)

***

### gravity

#### Get Signature

> **get** **gravity**(): `object`

Defined in: [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L93)

**`Experimental`**

Gets or sets the gravity acceleration of the physics world.

#### Example
```typescript
// Set gravity
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

##### Returns

`object`

Gravity acceleration vector for X, Y, and Z axes

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L93) |
| `y` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L93) |
| `z` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L93) |

#### Set Signature

> **set** **gravity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L97)

**`Experimental`**

Gravity acceleration vector of the physics world

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

> <span class="readonly-badge">readonly</span> **get** **nativeWorld**(): `World`

Defined in: [src/plugins/rapier/RapierPhysics.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L50)

**`Experimental`**

Returns the native World object of the physics engine.

##### Returns

`World`

Native Rapier World object

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`nativeWorld`](../../../../Physics/interfaces/IPhysicsEngine.md#nativeworld)

***

### RAPIER

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **RAPIER**(): `__module`

Defined in: [src/plugins/rapier/RapierPhysics.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L62)

**`Experimental`**

Returns the Rapier library namespace.

##### Returns

`__module`

Rapier namespace object

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`RAPIER`](../../../../Physics/interfaces/IPhysicsEngine.md#rapier)

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L191)

**`Experimental`**

Creates a physics body and colliders for the target mesh and registers them in the physics world.

#### Example
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
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | Target mesh to apply the physics body |
| `params` | [`BodyParams`](../../../../Physics/interfaces/BodyParams.md) | Configuration parameters for creating the physics body |

#### Returns

[`RapierBody`](RapierBody.md)

Created `RapierBody` instance

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createBody`](../../../../Physics/interfaces/IPhysicsEngine.md#createbody)

***

### createCharacterController()

> **createCharacterController**(`offset`): `KinematicCharacterController`

Defined in: [src/plugins/rapier/RapierPhysics.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L241)

**`Experimental`**

Creates and returns a character controller with autostep and snap-to-ground enabled.

#### Example
```typescript
const controller = physicsEngine.createCharacterController(0.1);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | Clearance offset between the character and surrounding obstacles |

#### Returns

`KinematicCharacterController`

Created `RAPIER.KinematicCharacterController` instance

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createCharacterController`](../../../../Physics/interfaces/IPhysicsEngine.md#createcharactercontroller)

***

### getBodyByColliderHandle()

> **getBodyByColliderHandle**(`handle`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L117)

**`Experimental`**

Finds and returns the managed `RapierBody` by its collider handle.

#### Example
```typescript
const body = physicsEngine.getBodyByColliderHandle(handle);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle` | `number` | Unique handle of the collider to find |

#### Returns

[`RapierBody`](RapierBody.md)

Found `RapierBody` instance (`undefined` if not found)

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/plugins/rapier/RapierPhysics.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L134)

**`Experimental`**

Initializes the Rapier engine and creates a physics world with default gravity.

#### Example
```typescript
await physicsEngine.init();
```

#### Returns

`Promise`\<`void`\>

`Promise` that resolves when initialization is complete

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`init`](../../../../Physics/interfaces/IPhysicsEngine.md#init)

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:220](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L220)

**`Experimental`**

Removes a physics body from the physics world.

#### Example
```typescript
// Remove physics body
physicsEngine.removeBody(body);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`RapierBody`](RapierBody.md) | `RapierBody` instance to remove |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`removeBody`](../../../../Physics/interfaces/IPhysicsEngine.md#removebody)

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierPhysics.ts#L157)

**`Experimental`**

Advances the physics simulation by one step, processes collision events, and synchronizes mesh transforms.

#### Example
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
