[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsBody

# Interface: IPhysicsBody

Defined in: [src/physics/IPhysicsBody.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L15)

**`Experimental`**

Interface that connects a physics engine's rigid body with a RedGPU mesh.

::: warning
This feature is currently in the experimental stage. The API may change in the future.
:::

## Properties

### nativeBody

> **nativeBody**: `any`

Defined in: [src/physics/IPhysicsBody.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L20)

**`Experimental`**

Native body object of the physics engine

***

### position

> **position**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L26)

**`Experimental`**

Current position of the physics body

***

### rotation

> **rotation**: [`quat`](../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L32)

**`Experimental`**

Current rotation (quaternion) of the physics body

***

### velocity

> **velocity**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L38)

**`Experimental`**

Current linear velocity of the physics body

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/physics/IPhysicsBody.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L55)

**`Experimental`**

Applies an impulse to the physics body.

### Example
```typescript
// Apply impulse along the Y-axis
body.applyImpulse([0, 5, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | Force vector to apply |

#### Returns

`void`

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/physics/IPhysicsBody.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L61)

**`Experimental`**

Synchronizes the physics simulation results to the transform of the connected mesh.

#### Returns

`void`
