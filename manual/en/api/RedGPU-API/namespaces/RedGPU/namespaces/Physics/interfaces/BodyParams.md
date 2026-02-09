[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / BodyParams

# Interface: BodyParams

Defined in: [src/physics/IPhysicsEngine.ts:10](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L10)

**`Experimental`**


Parameter interface for creating a physics body.

## Properties

### angularDamping?

> `optional` **angularDamping**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:45](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L45)

**`Experimental`**


Angular damping

***

### enableCCD?

> `optional` **enableCCD**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:55](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L55)

**`Experimental`**


Whether to enable Continuous Collision Detection (CCD)

***

### friction?

> `optional` **friction**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:30](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L30)

**`Experimental`**


Friction coefficient

***

### heightData?

> `optional` **heightData**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:60](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L60)

**`Experimental`**


Heightfield data (Required if shape is HEIGHTFIELD)

#### heights

> **heights**: `Float32Array`


Height data array

#### ncols

> **ncols**: `number`


Number of subdivisions along the X axis

#### nrows

> **nrows**: `number`


Number of subdivisions along the Z axis

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

> `optional` **isSensor**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:50](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L50)

**`Experimental`**


Whether it is a sensor (Generates events without collision response)

***

### linearDamping?

> `optional` **linearDamping**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:40](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L40)

**`Experimental`**


Linear damping

***

### mass?

> `optional` **mass**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:25](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L25)

**`Experimental`**


Mass

***

### restitution?

> `optional` **restitution**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:35](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L35)

**`Experimental`**


Restitution coefficient

***

### shape?

> `optional` **shape**: [`PhysicsShape`](../type-aliases/PhysicsShape.md)

Defined in: [src/physics/IPhysicsEngine.ts:20](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L20)

**`Experimental`**


Shape of the collider

***

### type?

> `optional` **type**: [`PhysicsBodyType`](../type-aliases/PhysicsBodyType.md)

Defined in: [src/physics/IPhysicsEngine.ts:15](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/physics/IPhysicsEngine.ts#L15)

**`Experimental`**


Type of the physics body (Static, Dynamic, Kinematic)
