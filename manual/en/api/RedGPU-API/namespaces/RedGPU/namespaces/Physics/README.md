[**RedGPU API v4.0.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / Physics

# Physics

**`Experimental`**


Provides core interfaces and common types for physics engine integration.


RedGPU's physics system is designed with a plugin-based architecture. It provides a structure that allows various physics libraries to be flexibly connected through a common interface that is not dependent on a specific physics engine.


Currently, the **Rapier** physics engine is supported as the primary plugin.

::: warning

The features in this package are currently in the experimental stage. The API may change in the future.
:::

## Other

- [BodyParams](interfaces/BodyParams.md)
- [PhysicsBodyType](type-aliases/PhysicsBodyType.md)
- [PhysicsShape](type-aliases/PhysicsShape.md)

## Physics

- [IPhysicsBody](interfaces/IPhysicsBody.md)
- [IPhysicsEngine](interfaces/IPhysicsEngine.md)
- [PHYSICS\_BODY\_TYPE](variables/PHYSICS_BODY_TYPE.md)
- [PHYSICS\_SHAPE](variables/PHYSICS_SHAPE.md)
