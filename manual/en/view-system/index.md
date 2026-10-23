---
title: View System
order: 3
---

# View System

The **View System** is the rendering pipeline that combines a 3D scene (`Scene`) and a camera (`Camera`) to output
frames to a designated region of the canvas.

---

## 1. Core Components

Below are the 4 core modules that make up RedGPU's rendering pipeline.

| Module           | Class / Namespace           | Primary Role                                                                                                                                             |
|:-----------------|:----------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`View3D`**     | `RedGPU.Display.View3D`     | Defines the screen output area (Viewport/Scissor) and manages environment lighting (`IBL`, `SkyBox`, `SkyAtmosphere`), post-effects, and debugging tools |
| **`Scene`**      | `RedGPU.Display.Scene`      | Centrally manages the 3D object hierarchy (Scene Graph), lighting (`LightManager`), shadows (`ShadowManager`), terrain, and water bodies                 |
| **`Camera`**     | `RedGPU.Camera.*`           | Computes projection and view matrices to transform 3D world space into 2D screen space, and controls physical exposure                                   |
| **`Controller`** | `RedGPU.Camera.*Controller` | Detects mouse, touch, and keyboard inputs to update camera viewpoints and character transforms in real time                                              |

---

## 2. Architecture Relationships

```mermaid
graph TD
    Context[RedGPUContext]
    
    subgraph MainView [View3D: Main View]
        View1[View3D Instance]
        Camera1[Camera: Main Camera]
        View1 -->|Owns (view.camera)| Camera1
    end
    
    subgraph MiniView [View3D: Minimap View]
        View2[View3D Instance]
        Camera2[Camera: Top-down Camera]
        View2 -->|Owns (view.camera)| Camera2
    end
    
    Scene[Scene: 3D Stage]
    
    Context -->|Owns & Renders| View1
    Context -->|Owns & Renders| View2
    
    View1 -->|Owns/References (view.scene)| Scene
    View2 -->|Owns/References (view.scene)| Scene
    
    Controller1[Controller] -->|Controls Camera| Camera1
    Controller2[Controller] -->|Controls Camera| Camera2
    
    Scene --> Meshes[Mesh 3D / Lights]

    style Context fill:#4a154b,stroke:#fff,stroke-width:2px,color:#fff
    style View1 fill:#0f4c81,stroke:#fff,stroke-width:2px,color:#fff
    style View2 fill:#0f4c81,stroke:#fff,stroke-width:2px,color:#fff
    style Scene fill:#1f6f43,stroke:#fff,stroke-width:2px,color:#fff
    style Camera1 fill:#d9534f,stroke:#fff,stroke-width:2px,color:#fff
    style Camera2 fill:#d9534f,stroke:#fff,stroke-width:2px,color:#fff
```

1. **`RedGPUContext`** holds one or more `View3D` instances and renders them sequentially.
2. Each **`View3D`** links what to render (`Scene`) with where to view it from (`Camera`).
3. Multiple **`View3D`** instances can reference a single **`Scene`** simultaneously to render different viewpoints
   (e.g., main screen and minimap).

---

## 3. Learning Roadmap

1. **[View3D](./view3d.md)**: Basic rendering unit and viewport layout configuration
2. **[Scene](./scene.md)**: 3D object hierarchy and lighting/environment managers
3. **[Camera](./camera.md)**: Perspective/orthographic projection and physical camera exposure
4. **[Camera Controller](./controller.md)**: Interactive camera and character manipulation via mouse and keyboard

---

## Related Examples

- [Single View](/RedGPU/examples/3d/view/singleView/)
- [Multi View](/RedGPU/examples/3d/view/multiView/)
- [Scene Configuration](/RedGPU/examples/3d/scene/)
- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)
