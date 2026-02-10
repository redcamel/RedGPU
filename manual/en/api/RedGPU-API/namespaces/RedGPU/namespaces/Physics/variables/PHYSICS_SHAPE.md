[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / PHYSICS\_SHAPE

# Variable: PHYSICS\_SHAPE

> `const` **PHYSICS\_SHAPE**: `object`

Defined in: [src/physics/PhysicsShape.ts:13](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L13)

**`Experimental`**


Defines the types of collider shapes used in physics simulations.

::: warning

This feature is currently in the experimental stage. The API may change in the future.
:::

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-box"></a> `BOX` | `"box"` | `'box'` | Box-shaped collider | [src/physics/PhysicsShape.ts:18](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L18) |
| <a id="property-capsule"></a> `CAPSULE` | `"capsule"` | `'capsule'` | Capsule-shaped collider | [src/physics/PhysicsShape.ts:28](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L28) |
| <a id="property-cylinder"></a> `CYLINDER` | `"cylinder"` | `'cylinder'` | Cylinder-shaped collider | [src/physics/PhysicsShape.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L33) |
| <a id="property-heightfield"></a> `HEIGHTFIELD` | `"heightfield"` | `'heightfield'` | Heightfield-shaped collider (Used for terrain, etc.) | [src/physics/PhysicsShape.ts:38](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L38) |
| <a id="property-mesh"></a> `MESH` | `"mesh"` | `'mesh'` | Arbitrary mesh-shaped collider (Trimesh) | [src/physics/PhysicsShape.ts:43](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L43) |
| <a id="property-sphere"></a> `SPHERE` | `"sphere"` | `'sphere'` | Sphere-shaped collider | [src/physics/PhysicsShape.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/PhysicsShape.ts#L23) |
