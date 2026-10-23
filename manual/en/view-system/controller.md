---
title: Camera Controller
order: 5
---

# Camera Controller

A **Controller** is an interaction module that detects mouse, touch, and keyboard inputs to control camera viewpoints or
3D character movement and jumping in real time.

---

## 1. Controller Types

RedGPU provides 4 standard camera controllers and a 3rd-person character controller tailored for different interaction
scenarios.

| Class                           | Namespace       | Control Method                                            | Primary Usage                                                                                    |
|:--------------------------------|:----------------|:----------------------------------------------------------|:-------------------------------------------------------------------------------------------------|
| **`OrbitController`**           | `RedGPU.Camera` | **Left Click**: Rotate / **Wheel**: Zoom                  | Product 360 viewer, character inspection, target-centered exploration                            |
| **`FollowController`**          | `RedGPU.Camera` | Automatic target mesh tracking (interpolated)             | 3rd-person (TPS) camera, moving object tracking                                                  |
| **`FreeController`**            | `RedGPU.Camera` | **W, A, S, D**: Move / **Mouse**: Rotate                  | 1st-person (FPS) view, architectural walkthroughs, open-world debugging                          |
| **`IsometricController`**       | `RedGPU.Camera` | Maintains a fixed isometric angle                         | Real-time strategy (RTS) games, isometric views                                                  |
| **`SimpleCharacterController`** | `RedGPU.Camera` | **W, A, S, D**: Move / **Space**: Jump / **Mouse**: Orbit | 3rd-person character locomotion, jump/gravity physics, and terrain (`Landscape`) height snapping |

> [!TIP]
> All controller classes internally instantiate and own a dedicated `Camera` instance. You do not need to create a
separate camera—simply pass the controller directly into the camera argument of
`new RedGPU.Display.View3D(redGPUContext, scene, controller)`.

---

## 2. OrbitController Configuration

Below are the key control properties of the most commonly used `OrbitController`.

| Property                              | Default       | Description                                                               |
|:--------------------------------------|:--------------|:--------------------------------------------------------------------------|
| **`centerX`, `centerY`, `centerZ`**   | `0`           | World coordinates of the center target around which the camera orbits     |
| **`distance`**                        | `15`          | Zoom distance of the camera from the center target                        |
| **`minDistance` / `maxDistance`**     | `1` / `10000` | Minimum and maximum zoom distance limits via mouse wheel or pinch-to-zoom |
| **`pan` / `tilt`**                    | `0` / `-35`   | Horizontal rotation angle (`pan`) and vertical rotation angle (`tilt`)    |
| **`minTilt` / `maxTilt`**             | `-90` / `90`  | Minimum and maximum vertical rotation angle limits                        |
| **`speedRotation` / `speedDistance`** | `3` / `2`     | Sensitivity multipliers for drag rotation and scroll wheel zoom           |

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

controller.centerY = 2;
controller.distance = 10;
controller.minDistance = 2;
controller.maxDistance = 30;
controller.minTilt = -60;
controller.maxTilt = 60;
```

---

## 3. 3rd-Person Character Controller and Terrain Snapping

`RedGPU.Camera.SimpleCharacterController` combines keyboard locomotion, jump/gravity physics, and a 3rd-person orbit
camera around a target mesh (`targetMesh`). By passing a `landscape.getHeightAt(x, z)` callback to
`update(dt, getGroundHeight)`, the character walks and jumps seamlessly along uneven open-world terrain surfaces.

| Property / Method                 | Default         | Description                                                                                                          |
|:----------------------------------|:----------------|:---------------------------------------------------------------------------------------------------------------------|
| **`moveSpeed`**                   | `8.0`           | Base character movement speed (world units/sec)                                                                      |
| **`jumpForce` / `gravity`**       | `8.5` / `-24.0` | Initial vertical velocity on jump (`Space`) and gravity acceleration                                                 |
| **`distance` / `heightOffset`**   | `6.0` / `1.5`   | Camera distance from the character and vertical look-at offset                                                       |
| **`groundHeight`**                | `0.0`           | Fallback ground plane Y height when no terrain callback is provided                                                  |
| **`isMoving` / `isGrounded`**     | Read-only       | Whether the character is currently moving or touching the ground (used for animation state transitions)              |
| **`update(dt, getGroundHeight)`** | `Method`        | Updates character locomotion, gravity, camera transform, and terrain height (`(x, z) => number`) snapping each frame |

```javascript
// 1. Create a SimpleCharacterController targeting the character mesh and bind to View3D
const charController = new RedGPU.Camera.SimpleCharacterController(redGPUContext, characterMesh);
charController.moveSpeed = 10;
charController.distance = 8;
charController.heightOffset = 1.8;

const view = new RedGPU.Display.View3D(redGPUContext, scene, charController);
redGPUContext.addView(view);

// 2. Update character movement and snap to terrain (Landscape) elevation each frame
let lastTime = performance.now();
renderer.start(redGPUContext, (time) => {
    const dt = (time - lastTime) * 0.001;
    lastTime = time;

    charController.update(dt, (x, z) => landscape.getHeightAt(x, z));
});
```

---

## 4. Experience Controller Samples

### OrbitController

Optimized for observing while rotating around a specific target.
<iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FreeController

Explore space freely from a first-person perspective using the **W, A, S, D** keys and the mouse.
<iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### IsometricController

Suitable for strategy simulations or infographics by maintaining a fixed angle.
<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FollowController

Provides a viewpoint that smoothly follows characters or moving objects.
<iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

---

## Related Examples

- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)
- [FreeController](/RedGPU/examples/3d/controller/freeController/)
- [FollowController](/RedGPU/examples/3d/controller/followController/)
- [IsometricController](/RedGPU/examples/3d/controller/isometricController/)

---

## Next Steps

- **[Basic Objects Overview](../basic-objects/index.md)**: Composing 3D objects using `Mesh`, `Scene Graph`, and
  `Texture`
