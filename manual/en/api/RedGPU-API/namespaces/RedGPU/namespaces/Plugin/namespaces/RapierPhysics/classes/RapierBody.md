[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierBody

# Class: RapierBody

Defined in: [src/plugins/rapier/RapierBody.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L14)

**`Experimental`**

`IPhysicsBody` implementation class that synchronizes and controls transforms between a Rapier `RigidBody` and a RedGPU `Mesh`.

## Implements

- [`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md)

## Constructors

### Constructor

> **new RapierBody**(`mesh`, `body`, `collider`): `RapierBody`

Defined in: [src/plugins/rapier/RapierBody.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L33)

**`Experimental`**

Creates a RapierBody instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | RedGPU `Mesh` instance to bind |
| `body` | `RigidBody` | Rapier `RigidBody` instance |
| `collider` | `Collider` | Rapier `Collider` instance |

#### Returns

`RapierBody`

## Accessors

### mesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/plugins/rapier/RapierBody.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L47)

**`Experimental`**

Returns the bound RedGPU `Mesh` instance.

##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

Bound `Mesh` instance

***

### nativeBody

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nativeBody**(): `RigidBody`

Defined in: [src/plugins/rapier/RapierBody.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L59)

**`Experimental`**

Returns the native Rapier `RigidBody` object.

##### Returns

`RigidBody`

Rapier `RigidBody` object

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`nativeBody`](../../../../Physics/interfaces/IPhysicsBody.md#nativebody)

***

### nativeCollider

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nativeCollider**(): `Collider`

Defined in: [src/plugins/rapier/RapierBody.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L71)

**`Experimental`**

Returns the native Rapier `Collider` object.

##### Returns

`Collider`

Rapier `Collider` object

***

### position

#### Get Signature

> **get** **position**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L83)

**`Experimental`**

Gets or sets the world position of the physics body.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

World position vector (`vec3`)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L88)

**`Experimental`**

Current position of the physics body

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`position`](../../../../Physics/interfaces/IPhysicsBody.md#position)

***

### rotation

#### Get Signature

> **get** **rotation**(): [`quat`](../../../../Math/type-aliases/quat.md)

Defined in: [src/plugins/rapier/RapierBody.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L104)

**`Experimental`**

Gets or sets the rotation quaternion (`quat`) of the physics body.

##### Returns

[`quat`](../../../../Math/type-aliases/quat.md)

Rotation quaternion (`quat`)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L109)

**`Experimental`**

Current rotation (quaternion) of the physics body

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`quat`](../../../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`rotation`](../../../../Physics/interfaces/IPhysicsBody.md#rotation)

***

### velocity

#### Get Signature

> **get** **velocity**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L125)

**`Experimental`**

Gets or sets the linear velocity (`vec3`) of the physics body.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

Linear velocity vector (`vec3`)

#### Set Signature

> **set** **velocity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L130)

**`Experimental`**

Current linear velocity of the physics body

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`velocity`](../../../../Physics/interfaces/IPhysicsBody.md#velocity)

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L151)

**`Experimental`**

Applies an instantaneous impulse to the physics body.

#### Example
```typescript
body.applyImpulse([0, 10, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Impulse vector to apply (`vec3` or `{ x, y, z }`) |

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`applyImpulse`](../../../../Physics/interfaces/IPhysicsBody.md#applyimpulse)

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/plugins/rapier/RapierBody.ts#L163)

**`Experimental`**

Synchronizes the position and rotation results of the physics simulation to the bound `Mesh`.

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`syncToMesh`](../../../../Physics/interfaces/IPhysicsBody.md#synctomesh)
