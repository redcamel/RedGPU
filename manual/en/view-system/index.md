---
title: View System
order: 3
---

<script setup>
const viewSystemArchGraph = `
    graph TD
        Context["RedGPUContext"]
        
        subgraph MainView ["View3D (Main View)"]
            View1["View3D Instance"]
            Camera1["Camera (Main Camera)"]
            View1 -->|Owns| Camera1
        end
        
        subgraph MiniView ["View3D (Minimap View)"]
            View2["View3D Instance"]
            Camera2["Camera (Top-Down Camera)"]
            View2 -->|Owns| Camera2
        end
        
        Scene["Scene (3D Stage)"]
        Meshes["Mesh / Light / Environment"]
        Controller1["Controller"]
        Controller2["Controller"]
        
        Context -->|Registers & Renders| View1
        Context -->|Registers & Renders| View2
        
        View1 -->|References| Scene
        View2 -->|Shared Reference| Scene
        
        Controller1 -->|Controls Viewpoint| Camera1
        Controller2 -->|Controls Viewpoint| Camera2
        
        Scene -->|Contains| Meshes

        %% Grayscale styles applied
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style MainView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style MiniView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style View1 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style View2 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style Camera1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Camera2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Meshes fill:#fafafa,stroke:#e4e4e7,color:#3f3f46,stroke-width:1px
`
</script>

# View System

If `RedGPUContext` learned earlier is the 'environment' where the engine runs, the **View System** is the 'frame' that
determines how actual content is displayed within that environment.

## 1. Architecture and Role

As the core architecture of RedGPU that binds 3D spatial data with camera viewpoints to render on screen, the **View
System** performs the following roles:

- **Scene Composition**: Defines the hierarchical placement of objects and lights in 3D space (`Scene`)
- **Viewpoint & Input Control**: Projects 3D space onto a 2D screen and updates the viewpoint according to user input
  (`Camera`, `AController`)
- **Screen Output & Environment Isolation**: Defines viewport bounds and applies independent environment settings and
  post-effects per view (`View3D`)

<ClientOnly>
  <MermaidResponsive :definition="viewSystemArchGraph" />
</ClientOnly>

1. `RedGPUContext` holds one or more `View3D` instances (e.g., main game screen and minimap).
2. Each `View3D` connects what to display (`Scene`) with where to look from (`Camera`).
3. Controllers (such as `OrbitController`) receive user input and move the `Camera`.

Thanks to this architecture, a single `Scene` can be viewed simultaneously from multiple angles through multiple
`View3D` instances.

---

## 2. Core Components

The four core modules that make up RedGPU's rendering pipeline:

| Module            | Primary Role & Features                                                                                                                                                                     |
|:------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`View3D`**      | Specifies the screen output area (Viewport) and manages skybox (`skybox`), environment lighting (`ibl`), post-effects (`postEffectManager`), and debugging tools (`grid`, `axis`) per view. |
| **`Scene`**       | Centrally manages the hierarchy of 3D objects to render (Scene Graph), lighting (`lightManager`), shadows (`shadowManager`), and terrain/water systems.                                     |
| **`Camera`**      | Computes the Projection and View matrices that transform 3D space into 2D screen space and manages automatic exposure (`useAutoExposure`).                                                  |
| **`AController`** | Detects mouse, touch, and keyboard input to update camera transforms in real time (`OrbitController`, `FreeController`, `FollowController`, etc.).                                          |

---

## 3. Learning Roadmap

We recommend learning the detailed usage and configuration of each module in the following order:

1. **[View3D](./view3d.md)**: Basic rendering unit and viewport layout configuration
2. **[Scene](./scene.md)**: Root container that composes the stage and manages objects and lights
3. **[Camera](./camera.md)**: Understanding viewpoints that transform 3D coordinates into screen coordinates
4. **[Camera Controller](./controller.md)**: Interactive camera manipulation via mouse, touch, and keyboard

---

## Related Examples

- [Single View](/RedGPU/examples/3d/view/singleView/)
- [Multi View](/RedGPU/examples/3d/view/multiView/)
- [Scene Configuration](/RedGPU/examples/3d/scene/)
- [OrbitController](/RedGPU/examples/3d/controller/orbitController/)

---

## Next Steps

First, let's explore how to create `View3D`—the core rendering unit of the View System—and control its viewport layout.

- **[View3D](./view3d.md)**: Basic rendering unit and viewport layout configuration
