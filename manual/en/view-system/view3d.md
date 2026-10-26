---
title: View3D
description: Technical specification and usage of View3D, the rendering unit in RedGPU.
order: 2
---
<script setup>
const viewSystemGraph = `
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Viewport)"]
        Scene["Scene (3D Spatial Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input Control)"]

        Context -->|Manages| View
        View -->|References| Scene
        View -->|References| Camera
        Controller -->|Updates| Camera
        View -.->|Holds| Controller
        
        %% Grayscale styles applied
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`

const multiViewGraph = `
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A (Shared Scene)"]
        CameraX["Camera X (Main View)"]
        CameraY["Camera Y (Sub View)"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared Reference| SceneA
        View2 --> CameraY

        %% Grayscale styles applied
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View1 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View2 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style SceneA fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style CameraX fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style CameraY fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# View3D

Serving as the core frame of the **View System**, `View3D` is an object that defines the actual **Viewport** area where
rendering is performed within `RedGPUContext`. It binds spatial scene data (`Scene`) and viewpoint information
(`Camera`) together to act as a **Render Pass** that generates the final frame.

## 1. Architecture and Role

`View3D` references a `Scene` and a `Camera` (or controller) and must be registered via `redGPUContext.addView(view)` to
be included in the rendering loop.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

A `View3D` instance provides the following independent capabilities:

- **Independent Environment Settings**: Skybox (`skybox`), atmospheric scattering (`skyAtmosphere`), Image-Based
  Lighting (`ibl`), post-effects (`postEffectManager`), and tone mapping (`toneMappingManager`) can be configured per
  view.
- **Debugging Tools**: Grid (`grid`) and axis (`axis`) visibility can be toggled individually per view.
- **Multi-View Operation**: Multiple independent views can be rendered simultaneously within a single `RedGPUContext`.

---

## 2. Basic Usage

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. Create Scene and Camera(Controller)
        const scene = new RedGPU.Display.Scene();
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. Create View3D and enable debug grid & axis
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;

        // 3. Register view in context and start renderer
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    }
);
```

### Live Demo

<ClientOnly>
  <CodePen title="RedGPU Basics - View3D" slugHash="view-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
const controller = new RedGPU.Camera.OrbitController (redGPUContext);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true; 
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
  </CodePen>
</ClientOnly>

---

## 3. Size and Resolution Management

`View3D` determines the area it occupies within the canvas and its rendering resolution. To support responsive layouts,
it manages the CSS pixel layout size separately from the actual GPU rendering resolution.

### Setting Bounds (Size & Position)

Specify the size and position of a view using `setSize()` and `setPosition()`. Numbers (`number`), percentages (`%`),
and pixel (`px`) strings are all supported.

```javascript
// Numbers or pixel (px) strings can be used
view.setSize(500, 300);
view.setSize('500px', '300px');

// Percentage (%) units can be used
view.setSize('100%', '100%');

// Setting position
view.setPosition(10, 10);
view.setPosition('10px', '10%');
```

::: tip [Pixel Unit Guide]
Two coordinate objects are provided to support high-DPI (HiDPI/Retina) displays:

* **`view.screenRectObject`**: **Layout Size** in CSS pixels. Used for **UI placement** or **mouse event coordinate
  calculations**.
* **`view.pixelRectObject`**: Actual **Physical Resolution** with `devicePixelRatio` applied. Used for internal
  rendering calculations.
  :::

### Per-View Resize Detection (`onResize`)

While `redGPUContext.onResize` detects size changes of the entire canvas, the `onResize` callback on an individual
`View3D` instance is invoked whenever that specific view's size changes.

This is useful when a view's size is set in percentages (`%`) and the parent canvas resizes, or when the size is changed
directly via `setSize()`. The callback receives an event object conforming to the `RedResizeEvent` interface.

#### `RedResizeEvent` Interface Structure

| Property               | Type                 | Description                                                                            |
|:-----------------------|:---------------------|:---------------------------------------------------------------------------------------|
| **`target`**           | `T` (e.g., `View3D`) | The target view instance where the event occurred                                      |
| **`screenRectObject`** | `IRedGPURectObject`  | Size and position information in CSS pixels (`{ x, y, width, height }`)                |
| **`pixelRectObject`**  | `IRedGPURectObject`  | Physical pixel information with `devicePixelRatio` applied (`{ x, y, width, height }`) |

```javascript
// Define callback invoked when the individual view size changes
view.onResize = (event) => {
    const { target, screenRectObject, pixelRectObject } = event;
    const { width, height } = screenRectObject;
    console.log(`View bounds changed: ${width}x${height} (Physical resolution: ${pixelRectObject.width}x${pixelRectObject.height})`);
    
    // Reposition UI elements within the view or adjust camera settings
};
```

---

## 4. Debugging Tools

Visual debugging helpers are provided to intuitively inspect the relative position and orientation of objects during
development.

* **`grid`**: Renders a reference grid on the base plane (**XZ** axes) of the 3D world to help gauge whether objects
  rest on the ground.
* **`axis`**: Displays color-coded **XYZ** axes centered at the world origin (**0, 0, 0**).
    * <span style="color:#ff3e3e;font-weight:bold">Red</span>: **X** Axis (Right)
    * <span style="color:#3eff3e;font-weight:bold">Green</span>: **Y** Axis (Up)
    * <span style="color:#3e3eff;font-weight:bold">Blue</span>: **Z** Axis (Depth)

---

## 5. Multi-View System

Registering multiple `View3D` instances in a single `RedGPUContext` allows rendering the same `Scene` simultaneously
from different camera viewpoints (split-screen, Picture-in-Picture minimap, etc.).

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

```javascript
const sharedScene = new RedGPU.Display.Scene();

// 1. Main view setup (Full screen)
const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. Minimap view setup (Fixed 200x200 at top-right)
const miniMapSize = 200;
const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
miniMapCamera.y = 50;
miniMapCamera.lookAt(0, 0, 0);

const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
miniMapView.setSize(miniMapSize, miniMapSize);
redGPUContext.addView(miniMapView);

// 3. Update minimap position on resize based on mainView's CSS layout size
redGPUContext.onResize = () => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
```

### Live Demo

<ClientOnly>
  <CodePen title="RedGPU Basics - Multi View" slugHash="view-multi">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const sharedScene = new RedGPU.Display.Scene();

        // 1. Main view setup (Full screen)
        const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
        const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
        mainView.setSize('100%', '100%');
        mainView.grid = true;
        redGPUContext.addView(mainView);

        // 2. Minimap view setup (Fixed 200x200 at top-right)
        const miniMapSize = 200;
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

        // 3. Update minimap position on resize based on mainView's CSS layout size
        const updateLayout = () => {
            const { width } = mainView.screenRectObject;
            miniMapView.setPosition(width - miniMapSize - 10, 10);
        };

        redGPUContext.onResize = updateLayout;
        updateLayout();

        // Populate scene objects
        const geometry = new RedGPU.Primitive.Box(redGPUContext);
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
        for (let i = 0; i < 30; i++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            mesh.x = Math.random() * 40 - 20;
            mesh.z = Math.random() * 40 - 20;
            sharedScene.addChild(mesh);
        }

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => console.error(error)
);
</pre>
  </CodePen>
</ClientOnly>

---

## Related Examples

- [Single View](/RedGPU/examples/3d/view/singleView/)
- [Multi View](/RedGPU/examples/3d/view/multiView/)
- [3D + 2D Hybrid Multi View](/RedGPU/examples/2d/view/multiViewWith3D/)

---

## Next Steps

Now that we have prepared the frame (`View3D`) to draw our view, it is time to construct the actual **Scene** (`Scene`)
that fills it. Let's explore the role and setup of `Scene`, where meshes and lights are placed.

- **[Scene](./scene.md)**: Structure and configuration of `Scene`, where 3D objects and lights are placed
