---
title: View3D
description: Covers technical specifications and usage of View3D, RedGPU's rendering unit.
order: 2
---
<script setup>
const viewSystemGraph = `
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Pass)"]
        Scene["Scene (Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input)"]

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
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

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

**View3D**, which acts as the core 'frame' of the View System, is an object that defines the **Viewport** within the **RedGPUContext** where rendering is actually performed. It acts as a **Render Pass** that groups scene data (**Scene**) and viewpoint information (**Camera**) together to generate the final frame.

## 1. Technical Overview

**View3D** operates on the GPU environment created from **RedGPUContext** and establishes relationships with other components as follows:

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

A **View3D** instance has the following independent settings and functions:

*   **Independent Environmental Settings**: Skyboxes, post-effects, etc., can be applied differently per view.
*   **Debugging Tool Support**: Individual control of grid and axis display.
*   **Multi-View Operation**: Allows simultaneous rendering of multiple independent views within a single context.

## 2. Initialization and Registration

To create and display a **View3D** on the screen, follow these steps:

1.  **Instance Creation**: Link and create a **Scene** and **Camera** after **RedGPUContext** is ready.
2.  **Context Registration**: Call the `addView()` method to include it in the rendering loop. Views not registered are not displayed on the screen.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. Prepare components (Scene and Camera)
        const scene = new RedGPU.Display.Scene();
        const camera = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. Create and configure View3D
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        view.grid = true; 
        view.axis = true;
        
        // 3. Register view in context (Required)
        redGPUContext.addView(view);

        // 4. Start renderer
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
    const camera = new RedGPU.Camera.OrbitController(redGPUContext);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true; 
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
  </CodePen>
</ClientOnly>

## 3. Size and Resolution Management

**View3D** determines the area it occupies within the canvas and its rendering resolution. For responsive layout support, it manages the size in CSS pixel units and the actual GPU rendering resolution separately.

### Area Configuration (Size & Position)

You can specify the size and position of the view through `setSize()` and `setPosition()` methods. Numeric (Number), percent (`%`), and pixel (`px`) units are all supported.

```javascript
// Numeric (Number) or pixel (px) strings can be used
view.setSize(500, 300);
view.setSize('500px', '300px');

// Percent (%) units can be used
view.setSize('100%', '100%');

// Position setup
view.setPosition(10, 10);
view.setPosition('10px', '10%');
```

::: tip [Pixel Unit Guide]
Two coordinate objects are provided for High-DPI (Retina) display support:
*   **`view.screenRectObject`**: The **Layout Size** in CSS pixel units. Use this for **UI placement** or **mouse event coordinate calculations**.
*   **`view.pixelRectObject`**: The actual **Physical Resolution** with `devicePixelRatio` applied. Used for internal rendering calculations.
:::

### 3.3 Detection of Per-View Size Changes (onResize)

While `redGPUContext.onResize` detects size changes of the entire canvas, the `onResize` callback of an individual **View3D** object is called whenever the size of that specific view changes.

This is particularly useful when the view's size is set in percentages (`%`) and the parent canvas size changes, or when
you explicitly change the size using `setSize()`. This callback receives an event argument of the `RedResizeEvent`
interface type.

#### RedResizeEvent Interface Structure

| Property               | Type                 | Description                                                                            |
|:-----------------------|:---------------------|:---------------------------------------------------------------------------------------|
| **`target`**           | `T` (e.g., `View3D`) | The target view instance where the event occurred                                      |
| **`screenRectObject`** | `IRedGPURectObject`  | Dimension and position information in CSS pixels (`{ x, y, width, height }`)           |
| **`pixelRectObject`**  | `IRedGPURectObject`  | Physical pixel information with `devicePixelRatio` applied (`{ x, y, width, height }`) |

```typescript
import {RedResizeEvent, View3D} from "RedGPU";

// Define callback to be called when an individual view's size changes
view.onResize = (event: RedResizeEvent<View3D>) => {
    const {target, screenRectObject, pixelRectObject} = event;
    const {width, height} = screenRectObject;
    console.log(`View area changed: ${width}x${height} (Physical: ${pixelRectObject.width}x${pixelRectObject.height})`);
    
    // Reposition specific UI elements within that view or adjust camera settings.
};
```


## 4. Debugging Tools

RedGPU provides visualization tools to help intuitively understand the relative position and direction of objects during development.

*   **grid**: Renders a grid on the ground plane (**XZ** axis) of the 3D world. It serves as a reference for judging whether objects are touching the ground.
*   **axis**: Displays **XYZ** axes in colors based on the world origin (**0, 0, 0**).
    *   <span style="color:#ff3e3e;font-weight:bold">Red</span>: **X** axis (Right)
    *   <span style="color:#3eff3e;font-weight:bold">Green</span>: **Y** axis (Up)
    *   <span style="color:#3e3eff;font-weight:bold">Blue</span>: **Z** axis (Depth)

## 5. Multi-View System

RedGPU supports multi-view rendering, allowing the operation of multiple viewports within a single context. Each view occupies a specific area of the screen and independently renders a scene and camera.

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

### Multi-View Configuration Example

Method for placing a main screen and a minimap utilizing **Layout Size** (screenRectObject) learned earlier.

```javascript
// [Assumption] Inside a RedGPU.init callback.
const sharedScene = new RedGPU.Display.Scene();

// 1. Setup Main View
const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. Setup Minimap View (Fixed top-right)
const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
miniMapCamera.y = 50;
miniMapCamera.lookAt(0, 0, 0);

const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
const miniMapSize = 200;
miniMapView.setSize(miniMapSize, miniMapSize);
redGPUContext.addView(miniMapView);

// 3. Update minimap position based on main view's layout size upon resizing
redGPUContext.onResize = (event) => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
```

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

        // Main view setup
        const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
        const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
        mainView.setSize('100%', '100%');
        mainView.grid = true;
        redGPUContext.addView(mainView);

        // Minimap view setup
        const miniMapSize = 200;
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0.1);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

        const updateLayout = (event) => {
            const { width } = mainView.screenRectObject;
            miniMapView.setPosition(width - miniMapSize - 10, 10);
        };

        redGPUContext.onResize = updateLayout;
        updateLayout();

        // Place scene objects
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

## 6. Key API Properties and Methods

The `View3D` class provides various APIs for adjusting 3D rendering quality, performance optimization, and utilities.

### 6.1 Environment and Lighting Settings

* **`skybox`** (`SkyBox`): Sets or gets the skybox instance to be drawn as the background of the view.
* **`skyAtmosphere`** (`SkyAtmosphere`): Sets or gets the sky atmosphere instance for rendering atmospheric scattering
  effects.
* **`ibl`** (`IBL`): Binds or gets the IBL data for image-based lighting effects.

### 6.2 Post-Processing and Tone-Mapping Managers

* **`postEffectManager`** (`PostEffectManager`): A manager to add and manage post-processing filters (such as blur,
  bloom, etc.) to be applied to this view area.
* **`toneMappingManager`** (`ToneMappingManager`): Manages the tone mapping policy that maps the high dynamic range (
  HDR) rendering results of this view to the standard monitor output range (SDR).

### 6.3 Rendering Optimization (Culling)

* **`useFrustumCulling`** (`boolean`, default: `true`): Automatically skips draw calls for meshes outside the camera's
  viewing frustum to improve frame rates.
* **`useDistanceCulling`** (`boolean`, default: `false`): Restricts rendering of objects that are further away than a
  specific distance from the camera.
* **`distanceCulling`** (`number`, default: `50`): The threshold distance used for distance-based culling.

### 6.4 Utility and Debug State Data

* **`renderViewStateData`** (`RenderViewStateData`, Read-only): A read-only object accumulating real-time rendering
  statistics of this view. Highly useful for performance profiling and culling debugging.
    * `renderResults.numDrawCalls`: Total number of Draw Calls triggered in the current view
    * `renderResults.numTriangles`: Total number of polygons (triangles) rendered in the current view
    * `renderResults.num3DObjects`: Number of 3D objects that passed culling and were actually rendered
    * `renderResults.numInstances`: Total number of instances processed via GPU instancing
    * `renderResults.numDirtyPipelines`: Count of compiled or updated pipelines
* **`screenToWorld(screenX, screenY)`**: Back-calculates 2D canvas screen coordinates (from mouse or touch) into 3D
  world space coordinates, returning a 3D vector array (`[x, y, z]`).
* **`checkMouseInViewBounds()`**: Checks if the mouse pointer is currently within the pixel bounds of this view,
  returning a `boolean`.

---

## Next Steps

We've prepared the 'frame' to draw the scene through **View3D**. Now it's time to compose the actual **Scene** to fill that frame.

Learn about the role and composition method of **Scene**, the space where meshes and lights are placed.

- **[Scene](./scene.md)**

