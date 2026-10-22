---
title: Camera Controller
order: 5
---

# Camera Controller

If the **Camera** learned earlier is the 'eye', the **Controller** is the 'joystick' that moves that eye. It is an **Interaction Module** that detects user input (mouse, touch, keyboard) and updates the camera's position and rotation in real-time. Using it allows you to build an intuitive 3D navigation environment without complex matrix operations.

## 1. Controller Types

RedGPU provides standard controllers that respond to various interaction scenarios.

| Class Name                      | Control Method                                                           | Main Usage                                                                              |
|:--------------------------------|:-------------------------------------------------------------------------|:----------------------------------------------------------------------------------------|
| **`OrbitController`**           | **Left Click**: Rotate<br>**Wheel**: Zoom                                | Product 360 viewer, character observation, exploration centered on a specific target    |
| **`FollowController`**          | Automatic target tracking (smooth interpolation)                         | TPS (3rd-person) games, character tracking camera                                       |
| **`FreeController`**            | **W, A, S, D**: Move<br>**Mouse**: Gaze rotation                         | FPS games, architectural interior tours, debugging                                      |
| **`IsometricController`**       | Maintains a fixed 45-degree angle                                        | Real-time strategy (RTS) games, isometric views                                         |
| **`SimpleCharacterController`** | **W, A, S, D**: Move character<br>**Space**: Jump / **Mouse**: TPS orbit | 3rd-person character movement, terrain (`Landscape`) height snapping, water interaction |

::: tip [Camera Instance Management]
All **Controller** classes internally create and own a dedicated **Camera** instance. Therefore, you don't need to create a separate camera when creating a **Controller**; just pass the controller into the camera argument when creating `View3D`, and it will be linked automatically.
:::

## 2. Key APIs and Configuration

Each controller provides its own unique properties to finely tune rotation speeds, range limits, zoom boundaries, etc.
The key properties of the most widely used `OrbitController` are as follows.

### Key Properties of OrbitController

* **`centerX`, `centerY`, `centerZ`** (`number`, default: `0`):
  * The center target coordinate around which the camera orbits.
* **`distance`** (`number`, default: `15`):
  * The distance (zoom distance) of the camera from the center target.
* **`minDistance`, `maxDistance`** (`number`):
  * The minimum and maximum zoom limits that can be pulled in or pushed out via mouse wheel or pinch-to-zoom.
* **`pan`, `tilt`** (`number`):
  * Angle values for the camera's horizontal rotation (`pan`) and vertical rotation (`tilt`).
* **`minTilt`, `maxTilt`** (`number`, default: `-90` to `90`):
  * The minimum and maximum limit angles for vertical (up/down) rotation.
* **`speedRotation`, `speedDistance`** (`number`):
  * Sensitivity speed coefficients for drag rotation and scroll wheel zoom.

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);

// Adjust center target up along the Y-axis and bring the camera distance closer
controller.centerY = 2;
controller.distance = 10;

// Fix range so that the camera does not zoom too close or too far
controller.minDistance = 2;
controller.maxDistance = 30;

// Restrict vertical rotation to prevent flipping upside down
controller.minTilt = -60;
controller.maxTilt = 60;
```

---

## 3. Experience Controller Samples

Please experience the actual behavior of each controller directly through the previews below.

### OrbitController
Optimized for observing while rotating around a specific target.
<iframe src="/RedGPU/examples/3d/controller/orbitController/" ></iframe>

### FreeController
Explore space freely from a first-person perspective using the **W, A, S, D** keys and the mouse.
<iframe src="/RedGPU/examples/3d/controller/freeController/" ></iframe>

### IsometricController
Suitable for strategy simulations or infographics by maintaining a fixed angle.
<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>


### FollowController
Provides a viewpoint that smoothly follows characters or moving objects.
<iframe src="/RedGPU/examples/3d/controller/followController/" ></iframe>

---

## 4. 3rd-Person Character Controller (`SimpleCharacterController`)

`RedGPU.Camera.SimpleCharacterController` combines **W, A, S, D** character movement, **Space** jumping, gravity
physics, and a 3rd-person orbit camera around a target `Mesh`. It also accepts a custom ground height callback in
`update(deltaTime, getGroundHeight)` to snap characters seamlessly onto open-world terrain
(`landscape.getHeightAt(x, z)`).

| Property / Method                 | Default         | Description                                                                                               |
|:----------------------------------|:----------------|:----------------------------------------------------------------------------------------------------------|
| **`moveSpeed`**                   | `8.0`           | Character movement speed (units/sec)                                                                      |
| **`jumpForce` / `gravity`**       | `8.5` / `-24.0` | Jump initial velocity and gravity acceleration                                                            |
| **`distance` / `heightOffset`**   | `6.0` / `1.5`   | Camera distance from the character and vertical look-at offset                                            |
| **`groundHeight`**                | `0.0`           | Fallback ground plane Y height                                                                            |
| **`isMoving` / `isGrounded`**     | Read-only       | Whether the character is currently moving or touching the ground (useful for animation state transitions) |
| **`update(dt, getGroundHeight)`** | Method          | Updates character movement, gravity, camera transform, and terrain height snapping each frame             |

```javascript
// 1. Create a SimpleCharacterController targeting the character mesh
const charController = new RedGPU.Camera.SimpleCharacterController(redGPUContext, characterMesh);
charController.moveSpeed = 10;
charController.distance = 8;
charController.heightOffset = 1.8;

const view = new RedGPU.Display.View3D(redGPUContext, scene, charController);
redGPUContext.addView(view);

// 2. Update character movement and snap to terrain elevation in the render loop
let lastTime = performance.now();
renderer.start(redGPUContext, (time) => {
    const dt = (time - lastTime) * 0.001;
    lastTime = time;

    charController.update(dt, (x, z) => landscape.getHeightAt(x, z));
});
```

---

## Next Steps

Now you've learned how to configure and navigate the screen. However, the objects we've displayed so far had only simple colors.

Next, let's move on to the **Basic Objects** section to learn how to represent 3D objects more realistically through refined meshes and **Textures** with text and images applied.

- **[Basic Objects Overview](../basic-objects/)**