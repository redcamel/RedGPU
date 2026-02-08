---
title: View System
order: 3
---

# View System

If **RedGPUContext**—learned previously—is the 'environment' where the engine runs, the **View System** is the 'frame' that determines how actual content will be displayed within that environment.

RedGPU's **View System** is the core architecture of the engine and performs the following roles:

*   **Scene Composition**: Defining the hierarchical placement of objects and lights within 3D space.
*   **Pipeline Control**: Managing the rendering process and data flow.
*   **Screen Output**: Displaying the final results on the browser screen.

## Core Components

The four core modules that make up RedGPU's rendering pipeline are as follows. Each module performs an independent role and is organically combined.

| Component | Class Name | Role and Function |
| :--- | :--- | :--- |
| **View3D** | `RedGPU.Display.View3D` | Specifies the screen output area (Viewport/Scissor), applies skyboxes and post-effects, and manages debugging tools. |
| **Scene** | `RedGPU.Display.Scene` | Manages the hierarchical structure of objects to be rendered, as well as lighting data and the scene background color. |
| **Camera** | `RedGPU.Camera.*` | Calculates the projection and view matrices that convert 3D space to a 2D screen, and provides frustum information. |
| **Controller** | `RedGPU.Camera.*Controller` | Detects mouse, touch, and keyboard input, and updates the camera transform in real-time. |

## Understanding Relationships

Before learning more, it's important to understand how these elements are connected to each other.

1.  **RedGPUContext** has one or more **View3D** instances (e.g., a game screen and a minimap).
2.  Each **View3D** links what to show (**Scene**) and where to see it from (**Camera**).
3.  A **Controller** receives user input and moves the **Camera**.

Thanks to this structure, a single **Scene** can be observed from different angles simultaneously through multiple windows (**View3D**).

---

## Learning Roadmap

It is recommended to learn the detailed usage and configuration methods of each module in the following order:

1. **[View3D](./view3d.md)**: The basic unit of screen rendering and layout configuration methods.
2. **[Scene](./scene.md)**: The container for composing the stage and managing lighting.
3. **[Camera](./camera.md)**: Understanding viewpoints that convert 3D coordinates to screen coordinates.
4. **[Controller](./controller.md)**: Interactive camera manipulation through mouse and touch.