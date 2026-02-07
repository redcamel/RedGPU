---
title: Physics (Rapier)
order: 1
---

# Physics Plugin (Rapier)

RedGPU supports the high-performance WASM-based physics engine **Rapier** as a plugin. You can easily implement collision detection, gravity, rigid body simulation, and more in 3D space.

## 1. Initialization and Setup

To use the physics engine, you must first create and initialize a `RapierPhysics` instance. Since it loads WASM files, the `init()` method operates asynchronously.

```javascript
import { RapierPhysics } from "https://redcamel.github.io/RedGPU/dist/plugins/physics/rapier/index.js";

// 1. Create physics engine instance
const physicsEngine = new RapierPhysics();

// 2. Initialize physics engine (Load WASM)
await physicsEngine.init();

// 3. Register physics engine to the scene
scene.physicsEngine = physicsEngine;
```

## 2. Creating Physics Bodies

To grant physical properties to a mesh object, use the `createBody()` method.

```javascript
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(box);

// Create a physics body linked with the mesh
physicsEngine.createBody(box, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, // Dynamic body (Affected by gravity/forces)
    shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,        // Collision box shape
    mass: 1,                                        // Mass
    restitution: 0.5                                // Restitution (Bounciness)
});
```

## 3. Key Properties and Types

### PHYSICS_BODY_TYPE
Determines the physical behavior of the object.

- **`DYNAMIC`**: Responds to gravity and external forces (boxes, characters, etc.)
- **`STATIC`**: Fixed object that does not move (floor, walls, etc.)
- **`KINEMATIC`**: Moves only via code and transfers force to other objects.

### PHYSICS_SHAPE
Defines the shape of the collision area.

- **`BOX`**, **`SPHERE`**, **`CAPSULE`**, **`CYLINDER`**, **`CONE`**, **`PLANE`**, etc.

## 4. Live Examples

Explore various use cases of the physics engine provided by RedGPU.

### 4.1 Basic Simulation
- **[Basic Falling & Collision](https://redcamel.github.io/RedGPU/examples/physics/basic/)**: Demonstrates basic gravity and box collisions.
- **[Various Primitive Shapes](https://redcamel.github.io/RedGPU/examples/physics/shapes/)**: Check out various types of colliders like spheres, capsules, and cylinders.
- **[Kinematic Control](https://redcamel.github.io/RedGPU/examples/physics/kinematic/)**: Example of utilizing physics bodies whose movements are controlled directly via code.

### 4.2 Characters & Controllers
- **[Character Controller](https://redcamel.github.io/RedGPU/examples/physics/characterController/)**: Controls physical movement of characters in 1st/3rd person perspectives.
- **[Advanced Character Controller](https://redcamel.github.io/RedGPU/examples/physics/advancedCharacterController/)**: Sophisticated controller including stair climbing and slope handling.
- **[Ragdoll](https://redcamel.github.io/RedGPU/examples/physics/ragdoll/)**: Physics simulation of humanoid characters connected by joints.

### 4.3 Vehicles
- **[Raycast Vehicle](https://redcamel.github.io/RedGPU/examples/physics/raycastVehicle/)**: Car suspension and driving simulation based on the physics engine.

### 4.4 Joints & Constraints
- **[Basic Joints](https://redcamel.github.io/RedGPU/examples/physics/joints/)**: Physical connections between objects.
- **[Revolute Joint](https://redcamel.github.io/RedGPU/examples/physics/revoluteJoint/)**: Connection that rotates around a specific axis like a hinge.
- **[Spring Joint](https://redcamel.github.io/RedGPU/examples/physics/springJoint/)**: Connection effect with elasticity.

### 4.5 Advanced Effects & Optimization
- **[Buoyancy](https://redcamel.github.io/RedGPU/examples/physics/buoyancy/)**: Buoyancy effects within liquids.
- **[Soft Body](https://redcamel.github.io/RedGPU/examples/physics/softBody/)**: Deformable objects like cloth or jelly.
- **[Explosion](https://redcamel.github.io/RedGPU/examples/physics/explosion/)**: Producing explosions through impulse propagation.
- **[Mesh Collider](https://redcamel.github.io/RedGPU/examples/physics/meshCollider/)**: Collision area processing based on the actual complex geometry shape.

---

## Key Summary

- Supports powerful WASM-based physics calculations through **RapierPhysics**.
- Registering to `scene.physicsEngine` automatically updates the simulation every frame.
- Call `createBody` on mesh objects to immediately link physical properties.
