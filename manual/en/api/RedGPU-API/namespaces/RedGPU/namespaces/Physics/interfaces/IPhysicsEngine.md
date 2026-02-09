[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsEngine

# Interface: IPhysicsEngine

Defined in: [src/physics/IPhysicsEngine.ts:96](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L96)

**`Experimental`**


Interface to be implemented by physics engine plugins.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## Properties

### bodies

> `readonly` **bodies**: [`IPhysicsBody`](IPhysicsBody.md)[]

Defined in: [src/physics/IPhysicsEngine.ts:111](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L111)

**`Experimental`**


List of all physics bodies managed by the engine

***

### gravity

> **gravity**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:177](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L177)

**`Experimental`**


Sets or gets the gravity.

### Example
```typescript
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### nativeWorld

> `readonly` **nativeWorld**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:101](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L101)

**`Experimental`**


The native world instance of the physics engine (Escape Hatch)

***

### onCollisionStarted()

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/physics/IPhysicsEngine.ts:123](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L123)

**`Experimental`**


Callback called when a collision starts in the physics engine.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | Handle of the first collider |
| `handle2` | `number` | Handle of the second collider |

#### Returns

`void`

***

### RAPIER

> `readonly` **RAPIER**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:106](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L106)

**`Experimental`**


The physics engine library namespace (Escape Hatch)

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`IPhysicsBody`](IPhysicsBody.md)

Defined in: [src/physics/IPhysicsEngine.ts:157](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L157)

**`Experimental`**


Creates and attaches a physics body to a mesh.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target mesh |
| `params` | [`BodyParams`](BodyParams.md) | Body creation parameters |

#### Returns

[`IPhysicsBody`](IPhysicsBody.md)


Created physics body

***

### createCharacterController()

> **createCharacterController**(`offset`): `any`

Defined in: [src/physics/IPhysicsEngine.ts:190](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L190)

**`Experimental`**


Creates a character controller.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | Offset from the ground |

#### Returns

`any`


Character controller instance

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/physics/IPhysicsEngine.ts:133](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L133)

**`Experimental`**


Initializes the physics engine. (WASM loading, etc.)

#### Returns

`Promise`\<`void`\>


Promise that guarantees initialization completion

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:166](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L166)

**`Experimental`**


Removes a physics body.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`IPhysicsBody`](IPhysicsBody.md) | Body to remove |

#### Returns

`void`

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:142](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/physics/IPhysicsEngine.ts#L142)

**`Experimental`**


Steps the physics simulation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Time interval between frames |

#### Returns

`void`
