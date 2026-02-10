[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_BODY\_TYPE

# Variable: PHYSICS\_BODY\_TYPE

> `const` **PHYSICS\_BODY\_TYPE**: `object`

Defined in: [src/physics/PhysicsBodyType.ts:13](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L13)

**`Experimental`**


Defines the simulation types of physics bodies.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-dynamic"></a> `DYNAMIC` | `"dynamic"` | `'dynamic'` | Dynamic body affected by physics laws (gravity, collisions, etc.) | [src/physics/PhysicsBodyType.ts:18](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L18) |
| <a id="property-kinematic"></a> `KINEMATIC` | `"kinematic"` | `'kinematic'` | Kinematic body not affected by physics laws but controlled directly by code (Position based) | [src/physics/PhysicsBodyType.ts:28](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L28) |
| <a id="property-kinematic_position"></a> `KINEMATIC_POSITION` | `"kinematicPosition"` | `'kinematicPosition'` | Kinematic body not affected by physics laws but controlled directly by code (Position based) | [src/physics/PhysicsBodyType.ts:33](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L33) |
| <a id="property-kinematic_velocity"></a> `KINEMATIC_VELOCITY` | `"kinematicVelocity"` | `'kinematicVelocity'` | Kinematic body controlled by velocity | [src/physics/PhysicsBodyType.ts:38](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L38) |
| <a id="property-static"></a> `STATIC` | `"static"` | `'static'` | Fixed static body that does not move | [src/physics/PhysicsBodyType.ts:23](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/physics/PhysicsBodyType.ts#L23) |
