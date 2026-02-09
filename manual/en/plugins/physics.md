---
title: Physics (Rapier)
order: 1
---

# Physics Plugin (Rapier)

RedGPU supports the high-performance WASM-based physics engine **Rapier** as a plugin. Through this plugin, you can seamlessly integrate rigid body simulation, precise collision detection, and character controllers in 3D space into the engine.

::: warning Experimental Feature
The physics engine plugin is currently in the **experimental stage**. Please be aware that API specifications or behaviors may change without notice during development.
:::

## 0. Design Intent for Interface/Plugin Separation and Integration

RedGPU's physics system is designed with a strict separation between the common interface (`IPhysicsEngine`) and the actual implementation (Plugin) for seamless integration.

1.  **Bundle Size Optimization**:
    Physics engines (especially WASM-based ones) occupy significant binary space. Since not all projects require physics, excluding it from the main engine bundle optimizes initial loading speed.
2.  **Seamless Integration**:
    One of the most tedious tasks when using a physics engine is 'copying the coordinates of the physics world to 3D meshes every frame.' RedGPU automates this at the engine level, so a single `createBody` call automatically reflects position, rotation, scale, and even **complex child mesh hierarchies** into the physics world.
3.  **Interchangeability**:
    User code depends on the established `IPhysicsEngine` interface. This provides the flexibility to switch to other physics engines (e.g., Cannon, Ammo, etc.) in the future with minimal modifications to existing scene configurations or logic code.
4.  **Asynchronous Initialization Control**:
    WASM loading is inherently an asynchronous task. By separating it into a plugin, developers can clearly control when the physics engine is ready without interfering with the main engine's initialization flow.

## 1. Initialization and Setup

The physics engine is separated from the main engine bundle and must be imported separately. Since it involves loading WASM binaries, initialization is performed asynchronously.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. Create physics engine instance
const physicsEngine = new RapierPhysics();

// 2. Initialize engine (Load WASM and create world)
await physicsEngine.init();

// 3. Register physics engine to the Scene
// Upon registration, preparation for connecting objects within the scene with physics simulation is completed.
scene.physicsEngine = physicsEngine;
```

## 2. Automatic Simulation Integration

RedGPU synchronizes the physics engine registered in the Scene with the rendering loop and **updates it automatically**. Therefore, developers do not need to call a separate `step()` function every frame.

```javascript
// Automatic simulation starts just by registering the physics engine to the scene.
scene.physicsEngine = physicsEngine;
```

By default, physics calculations are performed at a fixed interval of 60 times per second (60FPS), ensuring consistent physics laws even in monitor environments with different refresh rates.

## 3. Creating and Connecting Physics Bodies

To grant physical properties to a general mesh object, use `createBody()`. RedGPU's physics system automatically synchronizes the state (position, rotation) of the created body to the mesh's transform.

```typescript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// Grant dynamic physical properties to the mesh
const body = physicsEngine.createBody(box, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, // Affected by physics laws
    shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,        // Box-shaped collider
    mass: 1.0,                                      // Mass (kg)
    restitution: 0.5                                // Restitution (0 ~ 1)
});

// Example of applying force (impulse) from outside
body.applyImpulse([0, 10, 0]);
```

### Compound Colliders
If the mesh passed when calling `createBody` includes child meshes, RedGPU automatically analyzes the hierarchy and creates a **compound collider** that includes the shapes of all children.

## 4. Full Constants and Settings Specification

### PHYSICS_BODY_TYPE
Defines the physical nature of how an object interacts with the world.
- `DYNAMIC`: Reacts to gravity and collisions, moving freely.
- `STATIC`: Fixed in space, does not move, and only participates in collisions. (Floors, walls, etc.)
- `KINEMATIC`: (Default) Ignores physics laws and controls movement directly via code.
- `KINEMATIC_POSITION`: Controlled by directly specifying position and rotation, and can push other objects.
- `KINEMATIC_VELOCITY`: Controls movement by specifying velocity.

### PHYSICS_SHAPE
The shape of the collider used in the simulation.
- `BOX`: Rectangular cuboid shape.
- `SPHERE`: Spherical shape.
- `CAPSULE`: Capsule shape.
- `CYLINDER`: Cylindrical shape.
- `HEIGHTFIELD`: Shape for grid-based heightmap data (terrain).
- `MESH`: Precise collider using complex mesh geometry as is.

### BodyParams (createBody configuration options)
All options that can be passed as the second argument when calling `createBody()`.
- `type`: Body type (`PHYSICS_BODY_TYPE`)
- `shape`: Collider shape (`PHYSICS_SHAPE`)
- `mass`: Mass (Default: 1.0)
- `friction`: Friction coefficient (0.0 ~ 1.0)
- `restitution`: Restitution coefficient (0.0 ~ 1.0, 1.0 is perfectly elastic collision)
- `linearDamping`: Damping force such as air resistance for linear movement
- `angularDamping`: Damping force for rotation
- `isSensor`: If set to true, only overlap events are generated without physical collision response.
- `enableCCD`: Enables Continuous Collision Detection. Prevents fast-moving objects from passing through thin walls.
- `heightData`: Terrain data object required when `shape` is `HEIGHTFIELD`.

---

## 5. Live Examples

Explore practical use cases of the physics engine through these categorized examples.

### 5.1 Basics & Shapes
- [Basic Simulation & Gravity Test](https://redcamel.github.io/RedGPU/examples/physics/basic/)
- [Various Collider Shapes](https://redcamel.github.io/RedGPU/examples/physics/shapes/)
- [Terrain (Heightfield) Simulation](https://redcamel.github.io/RedGPU/examples/physics/heightField/)

### 5.2 Controllers & Interaction
- [Kinematic Character Control](https://redcamel.github.io/RedGPU/examples/physics/characterController/)
- [Advanced Character Controller (Stairs/Slopes)](https://redcamel.github.io/RedGPU/examples/physics/advancedCharacterController/)
- [Mouse Click & Raycast Interaction](https://redcamel.github.io/RedGPU/examples/physics/raycast/)

### 5.3 Joints & Advanced Physics
- [Basic Joints](https://redcamel.github.io/RedGPU/examples/physics/joints/)
- [Revolute Joint](https://redcamel.github.io/RedGPU/examples/physics/revoluteJoint/)
- [Spring & Flexible Connection](https://redcamel.github.io/RedGPU/examples/physics/springJoint/)

---

## Key Summary
1. `RapierPhysics` must be imported separately and requires **asynchronous initialization**.
2. After registering `scene.physicsEngine`, simulation runs automatically.
3. `createBody` automatically reflects the mesh hierarchy in the physics world.
