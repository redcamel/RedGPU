---
title: View System
order: 3
---

# View System

If **RedGPUContext** learned previously is the 'environment' where the engine runs, **View System** is the 'frame' that determines how the actual content will be displayed on that environment.

RedGPU's **View System** is the core architecture of the engine and performs the following roles:

*   **Scene Composition**: Defining the hierarchical placement of objects and lights within 3D space
*   **Pipeline Control**: Managing the rendering process and data flow
*   **Screen Output**: Displaying final results on the browser screen

## Core Components

The 4 core modules that make up RedGPU's rendering pipeline are as follows. Each module performs an independent role and is organically combined.

| Component | Class Name | Role and Function |
| :--- | :--- | :--- |
| **View3D** | `RedGPU.Display.View3D` | Specifying screen output area (Viewport/Scissor), applying skyboxes and post-effects, managing debugging tools |
| **Scene** | `RedGPU.Display.Scene` | Managing hierarchical structure of objects to be rendered, managing lighting data and scene background color |
| **Camera** | `RedGPU.Camera.*` | Calculating projection and view matrices converting 3D space to 2D screen, providing frustum information |
| **Controller** | `RedGPU.Camera.*Controller` | Detecting mouse/touch/keyboard input and updating camera transform in real-time |

## Understanding Relationships

Before starting to learn, it's important to understand how these elements are connected to each other.

1.  **RedGPUContext** has one or more **View3D** instances. (e.g., game screen and minimap)
2.  Each **View3D** links what to show (**Scene**) and where to see it from (**Camera**).
3.  **Controller** receives user input and moves the **Camera**.

Thanks to this structure, a single scene (**Scene**) can be observed from different angles simultaneously through multiple windows (**View3D**).

---

## Learning Roadmap

It is recommended to learn the detailed usage and setting methods of each module in the following order:

1. **[View3D](./view3d)**: Basic unit of screen rendering and layout setting methods.
2. **[Scene](./scene)**: Container for composing the stage and managing lighting.
3. **[Camera](./camera)**: Understanding viewpoints that convert 3D coordinates to screen coordinates.
4. **[Controller](./controller)**: Interactive camera manipulation through mouse and touch.
