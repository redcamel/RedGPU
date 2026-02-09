[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsBody

# Interface: IPhysicsBody

Defined in: [src/physics/IPhysicsBody.ts:18](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L18)

**`Experimental`**


Interface that connects a physics engine's rigid body with a RedGPU mesh.


Through this interface, physics simulation results (position, rotation, etc.) can be reflected in the mesh, or the physics object can be controlled externally.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## Properties

### nativeBody

> **nativeBody**: `any`

Defined in: [src/physics/IPhysicsBody.ts:26](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L26)

**`Experimental`**


The native body object of the physics engine (Escape Hatch)


Used when direct access to unique features of a specific physics engine (e.g., Rapier) is required.

***

### position

> **position**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:37](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L37)

**`Experimental`**


Current position of the physics body

### Example
```typescript
body.position = [0, 10, 0];
```

***

### rotation

> **rotation**: [`quat`](../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:48](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L48)

**`Experimental`**


Current rotation of the physics body (Quaternion)

### Example
```typescript
body.rotation = [0, 0, 0, 1];
```

***

### velocity

> **velocity**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L59)

**`Experimental`**


Current linear velocity of the physics body

### Example
```typescript
const velocity = body.velocity;
```

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/physics/IPhysicsBody.ts:74](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L74)

**`Experimental`**


Applies an impulse to the physics body.

### Example
```typescript
body.applyImpulse([0, 5, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Vector of the force to apply |

#### Returns

`void`

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/physics/IPhysicsBody.ts:83](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsBody.ts#L83)

**`Experimental`**


Synchronizes the physics engine's simulation results to the transform of the connected mesh.


Normally called automatically in the rendering loop.

#### Returns

`void`
