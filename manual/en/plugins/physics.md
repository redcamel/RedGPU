---
title: Physics (Rapier)
order: 1
---

# Physics Plugin

The `RapierPhysics` plugin integrates the WASM-based **Rapier** physics engine via the `IPhysicsEngine` interface to
handle rigid body simulation, collision detection, character controllers, and compound collider synchronization.

> [!WARNING]
> The physics engine plugin is currently in the **Experimental** stage. API specifications or behaviors may change
during development.

## 1. Initialization and Automatic Simulation Integration

To optimize the core bundle size, the physics engine is separated into an independent module and initialized
asynchronously (`await physicsEngine.init()`) to load its WASM binary.

Assigning the instance to `scene.physicsEngine` automatically runs physics steps (at a fixed 60FPS interval by default)
and synchronizes mesh transforms inside the render loop without requiring manual `step()` calls.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. Create physics engine instance and asynchronously initialize WASM
const physicsEngine = new RapierPhysics();
await physicsEngine.init();

// 2. Register physics engine to Scene (starts automatic render loop synchronization)
scene.physicsEngine = physicsEngine;
```

---

## 2. Creating and Binding Physics Bodies

Call `physicsEngine.createBody(mesh, params)` to create a physics body for a `Mesh` and bind its position and rotation
synchronization. If the target mesh contains child meshes, RedGPU automatically analyzes the hierarchy and generates a
**Compound Collider** encompassing all child shapes.

```javascript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// Assign dynamic physical properties to the mesh
const body = physicsEngine.createBody(box, {
  type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
  shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
  mass: 1.0,
  restitution: 0.5
});

// Apply external impulse
body.applyImpulse([0, 10, 0]);
```

---

## 3. Constants and Configuration Options

### 3.1 `PHYSICS_BODY_TYPE` and `PHYSICS_SHAPE`

| Category                | Constant                                                  | Description                                                                                |
|:------------------------|:----------------------------------------------------------|:-------------------------------------------------------------------------------------------|
| **`PHYSICS_BODY_TYPE`** | **`DYNAMIC`**                                             | Rigid body that moves freely in response to gravity and collisions                         |
| **`PHYSICS_BODY_TYPE`** | **`STATIC`**                                              | Fixed in space without moving, participating only in collisions (floors, walls, etc.)      |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC`**                                           | Unaffected by physics forces and controlled directly via code (default)                    |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC_POSITION`**                                  | Controlled by directly specifying position and rotation, capable of pushing dynamic bodies |
| **`PHYSICS_BODY_TYPE`** | **`KINEMATIC_VELOCITY`**                                  | Controlled by specifying velocity                                                          |
| **`PHYSICS_SHAPE`**     | **`BOX`** / **`SPHERE`** / **`CAPSULE`** / **`CYLINDER`** | Primitive geometric collider shapes (box, sphere, capsule, cylinder)                       |
| **`PHYSICS_SHAPE`**     | **`HEIGHTFIELD`**                                         | Collider shape for grid-based heightmap terrain data (requires `heightData`)               |
| **`PHYSICS_SHAPE`**     | **`MESH`**                                                | Precise collider using the mesh's exact vertex and index geometry                          |

### 3.2 `BodyParams` (`createBody` Configuration Options)

| Property             | Default     | Description                                                                                             |
|:---------------------|:------------|:--------------------------------------------------------------------------------------------------------|
| **`type`**           | `KINEMATIC` | Physical behavior type of the body (`PHYSICS_BODY_TYPE`)                                                |
| **`shape`**          | `BOX`       | Collider shape (`PHYSICS_SHAPE`)                                                                        |
| **`mass`**           | `1.0`       | Mass (kg)                                                                                               |
| **`friction`**       | `0.5`       | Friction coefficient (`0.0 ~ 1.0`)                                                                      |
| **`restitution`**    | `0.0`       | Restitution coefficient (`0.0 ~ 1.0`, `1.0` is a perfectly elastic collision)                           |
| **`linearDamping`**  | `0.0`       | Damping factor (such as air resistance) for linear movement                                             |
| **`angularDamping`** | `0.0`       | Damping factor for rotation                                                                             |
| **`isSensor`**       | `false`     | When `true`, triggers overlap events without physical collision response                                |
| **`enableCCD`**      | `false`     | Enables Continuous Collision Detection to prevent fast-moving objects from tunneling through thin walls |
| **`heightData`**     | `undefined` | Terrain elevation data object required when `shape` is `HEIGHTFIELD`                                    |

---

## 4. Live Examples

- **Basics &
  Shapes**: [Basic Simulation & Gravity](/RedGPU/examples/physics/basic/) · [Collider Shapes](/RedGPU/examples/physics/shapes/) · [Terrain Heightfield](/RedGPU/examples/physics/heightField/)
- **Controllers &
  Interaction**: [Kinematic Character Control](/RedGPU/examples/physics/characterController/) · [Advanced Character Controller](/RedGPU/examples/physics/advancedCharacterController/) · [Click & Raycast](/RedGPU/examples/physics/raycast/)
-

**Joints**: [Basic Joints](/RedGPU/examples/physics/joints/) · [Revolute Joint](/RedGPU/examples/physics/revoluteJoint/) · [Spring Joint](/RedGPU/examples/physics/springJoint/)

---

## Next Steps

- **[Inspector](../inspector/index.md)**: Real-time performance monitoring and scene hierarchy debugging tool
