[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierBody

# Class: RapierBody

Defined in: [src/plugins/rapier/RapierBody.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L24)

**`Experimental`**


`IPhysicsBody` implementation for the Rapier physics engine.


It synchronizes and controls transform information between Rapier's RigidBody and RedGPU's Mesh. Simulation results are automatically reflected in the connected mesh's position and rotation every frame.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## See


 - [Physics Plugin Manual](https://redcamel.github.io/RedGPU/manual/en/plugins/physics)

## Implements

- [`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md)

## Constructors

### Constructor

> **new RapierBody**(`mesh`, `body`, `collider`): `RapierBody`

Defined in: [src/plugins/rapier/RapierBody.ts:43](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L43)

**`Experimental`**


Creates a RapierBody instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | RedGPU mesh to connect |
| `body` | `RigidBody` | Rapier rigid body object |
| `collider` | `Collider` | Rapier collider object |

#### Returns

`RapierBody`

## Accessors

### mesh

#### Get Signature

> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/plugins/rapier/RapierBody.ts:54](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L54)

**`Experimental`**


Returns the connected RedGPU mesh.

##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

***

### nativeBody

#### Get Signature

> **get** **nativeBody**(): `RigidBody`

Defined in: [src/plugins/rapier/RapierBody.ts:63](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L63)

**`Experimental`**


Returns the native Rapier rigid body object.

##### Returns

`RigidBody`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`nativeBody`](../../../../Physics/interfaces/IPhysicsBody.md#nativebody)

***

### nativeCollider

#### Get Signature

> **get** **nativeCollider**(): `Collider`

Defined in: [src/plugins/rapier/RapierBody.ts:72](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L72)

**`Experimental`**


Returns the native Rapier collider object.

##### Returns

`Collider`

***

### position

#### Get Signature

> **get** **position**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:80](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L80)

**`Experimental`**


Gets or sets the current position of the physics body.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L85)

**`Experimental`**


Current position of the physics body

### Example
```typescript
body.position = [0, 10, 0];
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:97](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L97)

**`Experimental`**


Gets or sets the current rotation (quaternion) of the physics body.

##### Returns

[`quat`](../../../../Math/type-aliases/quat.md)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:102](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L102)

**`Experimental`**


Current rotation of the physics body (Quaternion)

### Example
```typescript
body.rotation = [0, 0, 0, 1];
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L114)

**`Experimental`**


Gets or sets the current linear velocity of the physics body.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

#### Set Signature

> **set** **velocity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:119](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L119)

**`Experimental`**


Current linear velocity of the physics body

### Example
```typescript
const velocity = body.velocity;
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:140](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L140)

**`Experimental`**


Applies an impulse to the physics body.

* ### Example
```typescript
body.applyImpulse([0, 10, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Vector of the force to apply |

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`applyImpulse`](../../../../Physics/interfaces/IPhysicsBody.md#applyimpulse)

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L152)

**`Experimental`**


Synchronizes the physics simulation's position and rotation information to the connected RedGPU mesh.

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`syncToMesh`](../../../../Physics/interfaces/IPhysicsBody.md#synctomesh)
