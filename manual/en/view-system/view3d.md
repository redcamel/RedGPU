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
`

const viewGraph = `
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
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
redGPUContext.onResize = () => {
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

        const updateLayout = () => {
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

## 6. Rendering Flow

Work flow performed by **Renderer** as it iterates through the list of views registered in the context every frame.

<ClientOnly>
  <MermaidResponsive :definition="viewGraph" />
</ClientOnly>

## Next Steps

We've prepared the 'frame' to draw the scene through **View3D**. Now it's time to compose the actual **Scene** to fill that frame.

Learn about the role and composition method of **Scene**, the space where meshes and lights are placed.

- **[Scene](./scene.md)**
