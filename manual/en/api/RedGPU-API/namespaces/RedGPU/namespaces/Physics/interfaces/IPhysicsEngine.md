[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsEngine

# Interface: IPhysicsEngine

Defined in: [src/physics/IPhysicsEngine.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L98)

**`Experimental`**

Interface to be implemented by physics engine plugins.

::: warning
This feature is currently in the experimental stage. The API may change in the future.
:::

## Properties

### bodies

> <span class="readonly-badge">readonly</span> **bodies**: [`IPhysicsBody`](IPhysicsBody.md)[]

Defined in: [src/physics/IPhysicsEngine.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L113)

**`Experimental`**

List of all physics bodies managed by the engine

***

### gravity

> **gravity**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L131)

**`Experimental`**

Gravity acceleration vector of the physics world

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### nativeWorld

> <span class="readonly-badge">readonly</span> **nativeWorld**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L103)

**`Experimental`**

Native world instance of the physics engine

***

### onCollisionStarted

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/physics/IPhysicsEngine.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L126)

**`Experimental`**

Callback function invoked when a collision starts.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | Handle of the first collider |
| `handle2` | `number` | Handle of the second collider |

#### Returns

`void`

***

### RAPIER

> <span class="readonly-badge">readonly</span> **RAPIER**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L108)

**`Experimental`**

Physics engine library namespace

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`IPhysicsBody`](IPhysicsBody.md)

Defined in: [src/physics/IPhysicsEngine.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L167)

**`Experimental`**

Creates and attaches a physics body to a mesh.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target mesh object |
| `params` | [`BodyParams`](BodyParams.md) | Body creation configuration parameters |

#### Returns

[`IPhysicsBody`](IPhysicsBody.md)

Created `IPhysicsBody` instance

***

### createCharacterController()

> **createCharacterController**(`offset`): `any`

Defined in: [src/physics/IPhysicsEngine.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L190)

**`Experimental`**

Creates a character controller.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | Offset distance from the ground |

#### Returns

`any`

Created character controller instance

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/physics/IPhysicsEngine.ts:141](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L141)

**`Experimental`**

Asynchronously initializes the physics engine.

#### Returns

`Promise`\<`void`\>

Initialization completion `Promise<void>`

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L177)

**`Experimental`**

Removes a physics body from the physics world.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`IPhysicsBody`](IPhysicsBody.md) | Physics body to remove |

#### Returns

`void`

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsEngine.ts#L151)

**`Experimental`**

Advances the physics simulation by one step.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Elapsed time between frames in seconds |

#### Returns

`void`
