---
title: Inspector
order: 15
---

# Inspector

`RedGPUInspector` is a standalone developer tool package that monitors and controls FPS, GPU memory usage, draw call
counts, and scene object hierarchies in real time. To minimize production bundle size, it is provided as an independent
package (`inspector/dist/index.js`) separate from the core engine (`dist/index.js`).

> [!WARNING]
> The Inspector is currently a Work In Progress. In particular, **Video Memory tracking** and **Draw Calls count** are
experimental metrics and should be used for reference only.

---

## 1. Initialization and Usage

Import `RedGPUInspector` separately, pass `redGPUContext` to instantiate it, and toggle the GUI panel visibility via the
`useDebugPanel` property.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
import RedGPUInspector from "https://redcamel.github.io/RedGPU/inspector/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const inspector = new RedGPUInspector(redGPUContext);

    // Enable the GUI debug panel (set to false to hide)
    inspector.useDebugPanel = true;
});
```

---

## 2. Panel Tabs and Monitoring Metrics

The Inspector panel is organized into 5 sections that display frame performance and GPU resource states in real time.

| Tab / Section                | Key Metrics & Resources                                                                                                    | Description                                                                                                                                             |
|:-----------------------------|:---------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Performance Monitor**      | `FPS`, `Avg FPS`, `1% Low FPS`, `0.1% Low FPS`, `Frame Time`                                                               | Graphs current/average frame rates, bottom 1%/0.1% stuttering/spike metrics, and elapsed time per frame (ms).                                           |
| **Rendering Statistics**     | `Draw Calls`, `Triangles`, `Points`, `3D Objects`, `3D Groups`, `Instances`, `Video Memory`                                | Displays current frame draw calls (reference), rendered triangles/points, scene object/group/instance counts, and total video memory in MB (reference). |
| **GPU Memory Resources**     | `BitmapTexture`, `CubeTexture`, `HDRTexture`, `UniformBuffer`, `VertexBuffer`, `IndexBuffer`, `StorageBuffer`, `GPUBuffer` | Tracks instance counts (`count`) and memory footprint for each type of GPU-uploaded texture and buffer.                                                 |
| **Scene Hierarchy**          | `View3D`, `Scene`, child display object tree                                                                               | Explores the object tree inside the scene in real time, grouped by currently active views (`View3D` / `View2D`).                                        |
| **Command Batch Statistics** | Command buffers, render passes, compute passes                                                                             | Diagnoses the number of command buffers, render passes, and compute passes executed in each phase of the rendering pipeline.                            |

---

## 3. Practical Debugging Tips

> [!TIP]
> - **Draw Call Optimization**: If the `Draw Calls` count is high, group objects sharing the same geometry and material
    into an `InstancedMesh` to reduce draw calls.
> - **Memory Leak Detection**: If resource counts (`count`) in the **GPU Memory Resources** tab keep increasing after
    scene transitions or object removal, check whether unused resources are missing `destroy()` calls.

---

## Related Examples

- [Draw Debugger](/RedGPU/examples/3d/drawDebugger/basic/)
- [Mesh BoundBox Visualization](/RedGPU/examples/3d/mesh/boundBox/meshBoundBox/)
- [Indirect Draw Test](/RedGPU/examples/3d/indirectDrawTest/)
