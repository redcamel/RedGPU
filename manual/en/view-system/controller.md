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
<iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### FreeController

Freely explore 3D space from a first-person perspective using the **W, A, S, D** keys and mouse.
<iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>

### IsometricController

Maintains a fixed viewing angle suitable for strategy simulations or infographics.
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

Now that you have learned how to set up viewports and control camera viewpoints, the next **Basic Objects** section
covers how to create and manipulate 3D objects using `Mesh` (combining geometry and materials), hierarchical `Group3D`
structures, and image `Texture` mapping.

- **[Basic Objects Overview](../basic-objects/index.md)**: Composing 3D objects using `Mesh`, `Scene Graph`, and
  `Texture`
