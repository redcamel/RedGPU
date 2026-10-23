---
title: Camera
order: 4
---

<script setup>
const cameraGraph = `
    graph LR
        World["3D World Coordinates (Scene)"]
        ViewMat["View Matrix (position, lookAt)"]
        ProjMat["Projection Matrix (FOV / Ortho Bounds, Clipping)"]
        Screen["2D Screen Coordinates (View3D)"]

        World -->|View Transform| ViewMat
        ViewMat -->|Projection Transform| ProjMat
        ProjMat -->|Final Output| Screen

        %% Grayscale styles applied
        style World fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style ViewMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ProjMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Screen fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Camera

If `Scene` is the 'stage' where all objects are placed, `Camera` is the 'observer's eye' looking at that stage. It is
the core object that manages the **Projection Matrix** and **View Matrix** required to transform 3D **World
Coordinates** into 2D **Screen Coordinates**.

## 1. Architecture and Role

`Camera` determines from what position and field of view the 3D space is observed and passes this information to
`View3D`.

<ClientOnly>
  <MermaidResponsive :definition="cameraGraph" />
</ClientOnly>

- **Multiple Projection Modes**: Supports perspective projection (`PerspectiveCamera`), distortion-free orthographic
  projection (`OrthographicCamera`), and 2D screen projection (`Camera2D`).
- **Viewpoint & Frustum Control**: Controls the camera's world position (`setPosition`), target point (`lookAt`),
  vertical field of view (`fieldOfView`), and clipping plane distances (`nearClipping`, `farClipping`).
- **Automatic Exposure Management**: Automatically adapts screen brightness in real time according to ambient lighting
  changes via `useAutoExposure` by default.

---

## 2. Camera Types and Basic Setup

RedGPU provides three camera classes depending on the projection requirements; `PerspectiveCamera` is the standard
choice for 3D scenes.

| Class                    | Projection Mode | Description & Primary Use Case                                                                               |
|:-------------------------|:----------------|:-------------------------------------------------------------------------------------------------------------|
| **`PerspectiveCamera`**  | Perspective     | Standard 3D camera that applies depth-based perspective foreshortening.                                      |
| **`OrthographicCamera`** | Orthographic    | Preserves constant object proportions regardless of distance. Ideal for 2.5D isometric views or CAD viewers. |
| **`Camera2D`**           | 2D Planar       | Dedicated 2D rendering camera created automatically inside `View2D`.                                         |

`PerspectiveCamera` is instantiated without passing a context. After setting its position, call `lookAt(x, y, z)` to
orient the camera toward a target coordinate.

```javascript
const camera = new RedGPU.Camera.PerspectiveCamera();

// Configure vertical FOV and frustum clipping planes
camera.fieldOfView = 45;     // Vertical field of view (default: 60 degrees)
camera.nearClipping = 0.1;   // Near clipping plane distance (default: 0.1)
camera.farClipping = 50000;  // Far clipping plane distance (default: 50000)

// Move camera position and look at the origin
camera.setPosition(0, 5, -15);
camera.lookAt(0, 0, 0);
```

---

## 3. Practical Example: Camera Orbit and `lookAt()`

An example that moves the camera's `x` and `z` coordinates along a circular orbit each frame while calling
`lookAt(0, 0, 0)` to keep the camera focused on the center object.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. Create and configure PerspectiveCamera
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;
    camera.lookAt(0, 0, 0);

    // 2. Set up the scene (TorusKnot + Light)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    // 3. Orbit the camera and look at the origin every frame
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Camera lookAt" slugHash="camera-lookat">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Related Examples

- [OrbitController Camera Control](/RedGPU/examples/3d/controller/orbitController/)
- [IsometricController Orthographic Camera](/RedGPU/examples/3d/controller/isometricController/)
- [Frustum Culling](/RedGPU/examples/3d/frustumCulling/frustumCulling/)

---

## Next Steps

Instead of calculating camera coordinates manually in code, let's learn how to control the viewpoint intuitively using
mouse, touch, and keyboard input.

- **[Camera Controller](./controller.md)**: Interactive camera and character control using mouse, touch, and keyboard
