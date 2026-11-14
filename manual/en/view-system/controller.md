---
title: Camera Controller
order: 5
---

<script setup>
const controllerGraph = `
    graph LR
        Input["User Input (Mouse · Touch · Keyboard)"]
        Controller["Controller (Orbit / Free / Follow / Isometric)"]
        Camera["Built-in Camera (Updates View · Projection Matrix)"]
        View["View3D (Screen Rendering)"]

        Input -->|Detects Events| Controller
        Controller -->|Real-time Control| Camera
        Controller -.->|Registered Directly to View| View

        %% Grayscale styles applied
        style Input fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Camera fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# Camera Controller

If `Camera` learned earlier is the 'eye', **Controller** is the 'joystick' that moves that eye. It is an **Interaction
Module** that detects user input (mouse, touch, keyboard) to control the camera's position and rotation in real time,
enabling intuitive 3D navigation without complex matrix calculations.

## 1. Architecture and Role

<ClientOnly>
  <MermaidResponsive :definition="controllerGraph" />
</ClientOnly>

RedGPU provides four standard controllers (`AController`) tailored to different interaction scenarios:

| Class                     | Control Method                                        | Primary Use Case                                                              |
|:--------------------------|:------------------------------------------------------|:------------------------------------------------------------------------------|
| **`OrbitController`**     | **Left-Click**: Rotate / **Wheel**: Zoom              | 360-degree product viewers, character inspection, target-centered exploration |
| **`FollowController`**    | Automatic target mesh tracking (smooth interpolation) | Third-person (TPS) games, moving character tracking cameras                   |
| **`FreeController`**      | **W, A, S, D**: Move / **Mouse**: Look around         | First-person (FPS) viewpoints, architectural interior tours, world debugging  |
| **`IsometricController`** | Maintains a fixed isometric angle                     | Real-time strategy (RTS) games, isometric views                               |

::: tip [Camera Instance Management]
Every controller class automatically creates and owns a dedicated internal `Camera` instance. Therefore, when using a
controller, you do not need to create a separate camera—simply pass the controller directly to the camera parameter of
`new RedGPU.Display.View3D(redGPUContext, scene, controller)`.
:::

---

## 2. Try Out Controller Samples

Experience the live behavior of each controller directly in the interactive previews below.

### OrbitController

Optimized for rotating around and inspecting a specific target.

```javascript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 1;
controller.centerZ = 0;
controller.distance = 10; // Distance from target center
controller.pan = 45;      // Horizontal rotation angle (degrees)
controller.tilt = -20;    // Vertical tilt angle (degrees)
```

<iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FreeController

Freely explore 3D space from a first-person perspective using the **W, A, S, D** keys and mouse.

```javascript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
controller.x = 0;
controller.y = 5;
controller.z = 20;
controller.moveSpeed = 20;        // Movement speed
controller.mouseSensitivity = 0.15; // Mouse rotation sensitivity
```

<iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### IsometricController

Uses an internal `OrthographicCamera` to maintain a fixed quarter-view angle without perspective distortion, ideal for
strategy simulations or infographics.

```javascript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
controller.viewHeight = 15; // Orthographic view height
controller.zoom = 1.0;      // Zoom multiplier (minZoom ~ maxZoom)
controller.cameraAngle = 45; // Isometric horizontal rotation angle
```

<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FollowController

Provides a third-person viewpoint that smoothly tracks the movement and rotation of a character or moving object
(`targetMesh`).

```javascript
const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
controller.distance = 8;  // Distance behind the target
controller.height = 2;    // Camera height relative to the target
controller.pan = 0;       // Horizontal offset angle relative to the target
controller.tilt = 15;     // Vertical look-down angle
```

<iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

---

## 3. Character Movement Controller

When you need keyboard-driven 3D character movement (WASD/Arrow keys, running, jumping) and terrain height
synchronization (`getFloorHeight`) alongside camera control, you can combine `SimpleCharacterController` with your view
camera.

```javascript
const characterController = new RedGPU.Charactor.SimpleCharacterController(
        redGPUContext,
        characterMesh,
        view.camera,
        {
          speed: 3.0,
          runSpeed: 7.0,
          rotationSpeed: 8.0,
          jumpForce: 5.0,
          floorHeight: 0.0,
          getFloorHeight: (x, z) => landscape.getHeightAt(x, z), // Optional: dynamic terrain height callback
        }
);

// Pass deltaTime (seconds) every frame in the render loop
renderer.start(redGPUContext, (time) => {
  characterController.update(deltaTime);
});
```

---

## Related Examples

- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)
- [FreeController](/RedGPU/examples/3d/controller/freeController/)
- [FollowController](/RedGPU/examples/3d/controller/followController/)
- [IsometricController](/RedGPU/examples/3d/controller/isometricController/)
- [Keyboard Character Control](/RedGPU/examples/gltf/animation/keyboardCharacterControl/)

---

## Next Steps

Now that you have learned how to set up viewports and control camera viewpoints, the next **Basic Objects** section
covers how to create and manipulate 3D objects using `Mesh` (combining geometry and materials), hierarchical `Group3D`
structures, and image `Texture` mapping.

- **[Basic Objects Overview](../basic-objects/index.md)**: Composing 3D objects using `Mesh`, `Scene Graph`, and
  `Texture`
