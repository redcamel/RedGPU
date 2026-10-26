[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / BodyParams

# Interface: BodyParams

Defined in: [src/physics/IPhysicsEngine.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L12)

**`Experimental`**

Configuration parameter interface for creating a physics body.

## Properties

### angularDamping?

> `optional` **angularDamping?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L47)

**`Experimental`**

Angular damping

***

### enableCCD?

> `optional` **enableCCD?**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L57)

**`Experimental`**

Whether to enable Continuous Collision Detection (CCD)

***

### friction?

> `optional` **friction?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L32)

**`Experimental`**

Friction coefficient

***

### heightData?

> `optional` **heightData?**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L62)

**`Experimental`**

Heightfield data (Required when `shape` is `HEIGHTFIELD`)

#### heights

> **heights**: `Float32Array`

Height data array

#### ncols

> **ncols**: `number`

Number of subdivisions along the X-axis

#### nrows

> **nrows**: `number`

Number of subdivisions along the Z-axis

#### scale

> **scale**: `object`

Total scale of the collider

##### scale.x

> **x**: `number`

##### scale.y

> **y**: `number`

##### scale.z

> **z**: `number`

***

### isSensor?

> `optional` **isSensor?**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L52)

**`Experimental`**

Whether it acts as a sensor that triggers events without physical collision response

***

### linearDamping?

> `optional` **linearDamping?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L42)

**`Experimental`**

Linear damping

***

### mass?

> `optional` **mass?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L27)

**`Experimental`**

Mass

***

### restitution?

> `optional` **restitution?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L37)

**`Experimental`**

Restitution coefficient

***

### shape?

> `optional` **shape?**: [`PhysicsShape`](../type-aliases/PhysicsShape.md)

Defined in: [src/physics/IPhysicsEngine.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L22)

**`Experimental`**

Collider shape

***

### type?

> `optional` **type?**: [`PhysicsBodyType`](../type-aliases/PhysicsBodyType.md)

Defined in: [src/physics/IPhysicsEngine.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L17)

**`Experimental`**

Simulation type of the physics body (Static, Dynamic, Kinematic)
