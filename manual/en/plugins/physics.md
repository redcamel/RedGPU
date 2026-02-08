---
title: Physics (Rapier)
order: 1
---

# Physics Plugin (Rapier)

RedGPU supports the high-performance WASM-based physics engine **Rapier** as a plugin. Through this plugin, you can seamlessly integrate rigid body simulation, precise collision detection, and character controllers in 3D space into the engine.

::: warning Experimental Feature
The physics engine plugin is currently in the **experimental stage**. Please be aware that API specifications or behaviors may change without notice during development.
:::

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

## 4. Key Constants and Settings

### PHYSICS_BODY_TYPE
Defines how an object interacts with the world.
- `DYNAMIC`: Reacts to gravity and collisions, moving freely.
- `STATIC`: Fixed in space, does not move, and only participates in collisions. (Floors, walls, etc.)
- `KINEMATIC_POSITION`: Ignores physics laws, its position is controlled directly via code, and it can push other objects.

### PHYSICS_SHAPE
Basic collider shapes provided.
- `BOX`, `SPHERE`, `CAPSULE`, `CYLINDER`: Standard primitive shapes.
- `HEIGHTFIELD`: Heightmap shape for terrain data.
- `MESH`: Precise collider based on complex mesh data.

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