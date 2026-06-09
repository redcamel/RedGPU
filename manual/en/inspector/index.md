---
title: Inspector
order: 1
---

# Inspector

`RedGPUInspector` is a developer tool package for **performance profiling and real-time scene debugging** of RedGPU
applications.

It renders a GUI panel on screen that allows you to monitor FPS, GPU memory usage, draw call count, scene object
hierarchy, and more in real time—helping you quickly identify and debug performance issues during development.

## Inspector Architecture

The Inspector is designed as a **separate package** from the RedGPU core engine. This ensures that Inspector code is not
included in the production bundle, minimizing the final file size.

Therefore, the Inspector must always be loaded using **Dynamic Import**.

```
RedGPU Core (dist/index.js)
    ↕ Separate independent package
RedGPUInspector (inspector/dist/index.js)
```

## How to Use

### Basic Usage (CDN)

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    // ... set up scene, camera, mesh ...

    // Load the Inspector via dynamic import.
    import("https://redcamel.github.io/RedGPU/inspector/dist/index.js")
        .then(({ default: RedGPUInspector }) => {
            const inspector = new RedGPUInspector(redGPUContext);

            // Setting useDebugPanel to true activates the GUI panel.
            inspector.useDebugPanel = true;
        });
});
```

### Relative Path Import (Local Files)

If you have downloaded RedGPU files locally, specify the path relative to the current file's URL.

```javascript
import("https://redcamel.github.io/RedGPU/inspector/dist/index.js")
    .then(({ default: RedGPUInspector }) => {
        const inspector = new RedGPUInspector(redGPUContext);
        inspector.useDebugPanel = true;
    });
```

## API Reference

### `new RedGPUInspector(redGPUContext)`

Creates an Inspector instance.

| Parameter       | Type            | Description                                                   |
|:----------------|:----------------|:--------------------------------------------------------------|
| `redGPUContext` | `RedGPUContext` | The engine context received from the `RedGPU.init()` callback |

### `inspector.useDebugPanel`

A `getter/setter` property that controls the visibility of the debug panel.

```javascript
// Activate the panel
inspector.useDebugPanel = true;

// Deactivate the panel
inspector.useDebugPanel = false;

// Check current state
console.log(inspector.useDebugPanel); // true | false
```

## Panel Features

The Inspector panel is organized into multiple tabs, each providing different information.

### Performance Monitor

Collects real-time FPS and frame time data and displays it as a graph.

| Metric           | Description                                                        |
|:-----------------|:-------------------------------------------------------------------|
| **FPS**          | Current frame rate                                                 |
| **Avg FPS**      | Average frame rate                                                 |
| **1% Low FPS**   | Lowest FPS in the bottom 1% percentile (stuttering indicator)      |
| **0.1% Low FPS** | Lowest FPS in the bottom 0.1% percentile (extreme spike indicator) |
| **Frame Time**   | Time elapsed per frame (ms)                                        |

### Rendering Statistics (State)

Displays GPU workload information for the current rendering frame.

| Metric           | Description                                        |
|:-----------------|:---------------------------------------------------|
| **Draw Calls**   | Total draw call count for the current frame        |
| **Triangles**    | Total number of triangles rendered                 |
| **Points**       | Total number of points rendered                    |
| **3D Objects**   | Total number of 3D objects registered in the scene |
| **3D Groups**    | Total number of 3D groups registered in the scene  |
| **Instances**    | Total instance count                               |
| **Video Memory** | Total video memory currently used by the GPU (MB)  |

### GPU Memory Resources (Resources)

Displays the count and memory usage for each type of GPU-uploaded resource.

| Resource          | Description                   |
|:------------------|:------------------------------|
| **BitmapTexture** | Standard bitmap (2D) textures |
| **CubeTexture**   | Cubemap (skybox) textures     |
| **HDRTexture**    | HDR textures (for IBL)        |
| **UniformBuffer** | Uniform buffer objects        |
| **VertexBuffer**  | Vertex buffers                |
| **IndexBuffer**   | Index buffers                 |
| **StorageBuffer** | Storage buffers               |
| **GPUBuffer**     | Other GPU buffers             |

### Scene Hierarchy

Displays the object tree inside the Scene in real time, organized by the currently active View.

### Command Batch Statistics

Displays the number of command buffers, render passes, and compute passes for each phase of the rendering pipeline.
Useful for diagnosing and optimizing GPU rendering pass efficiency.

## Practical Tips

> [!TIP]
> **Draw Call Optimization**: If the Draw Calls count is excessively high, consider adopting instancing (
`InstancedMesh`). Grouping objects that share the same Geometry/Material via instancing can dramatically reduce draw
> calls.

> [!TIP]
> **Memory Leak Detection**: In the Resources tab, if the `count` of resources keeps increasing after actions like scene
> transitions, resources may not be getting properly disposed.

> [!NOTE]
> The Inspector is intended for **development use only**. When deploying to production, it is recommended to remove the
`inspector.useDebugPanel = true;` line or the entire dynamic import block.

## Next Steps

- **[RedGPU Context](../context/index.md)** : Advanced settings and resource management for the engine context.
- **[Post Effects](../post-effect/index.md)** : Post-processing effects to enhance visual quality.
- **[LOD](../lod/index.md)** : Automatic mesh quality adjustment based on distance for performance optimization.
