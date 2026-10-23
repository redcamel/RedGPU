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

`View3D` defines the **viewport** area where rendering is performed within `RedGPUContext`, combining spatial scene data
(`Scene`) and camera viewpoint information (`Camera` or `AController`) into a rendering unit.

A `View3D` instance provides the following independent capabilities:

- **Independent Environment Settings**: Skybox (`skybox`), atmospheric scattering (`skyAtmosphere`), Image-Based
  Lighting (`ibl`), post-effects (`postEffectManager`), and tone mapping (`toneMappingManager`) can be configured per
  view.
- **Debugging Tools**: Grid (`grid`) and axis (`axis`) visibility can be toggled individually per view.
- **Multi-View Operation**: Multiple independent views can be rendered simultaneously within a single `RedGPUContext`.

---

## 1. Architecture and Basic Usage

`View3D` references a `Scene` and a `Camera` (or controller) and must be registered via `redGPUContext.addView(view)` to
be included in the rendering loop.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

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

## 2. Viewport Sizing and Resize Detection

Viewport position and dimensions can be specified in numbers (`number`), pixels (`'500px'`), or percentages (`'100%'`).

- **`x` / `y`** (`number | string`): Gets or sets the top-left X and Y coordinates of the viewport (default: `0`).
- **`width` / `height`** (`number | string`): Gets or sets the viewport width and height (default: `'100%'`).
- **`setPosition(x, y)` / `setSize(width, height)`**: Sets position or size at once.
- **`screenRectObject`** (`IRedGPURectObject`): Returns the layout bounding rect `{ x, y, width, height }` in CSS
  pixels.
- **`pixelRectObject`** (`IRedGPURectObject`): Returns the actual physical pixel rect `{ x, y, width, height }` with
  `devicePixelRatio` and `renderScale` applied.

```javascript
view.setSize('50%', '100%');
view.setPosition('50%', 0);
```

### `onResize` Event Callback

Invoked whenever the view size changes, receiving a `RedResizeEvent<View3D>` object (`target`, `screenRectObject`,
`pixelRectObject`).

```javascript
view.onResize = (event) => {
    const {screenRectObject, pixelRectObject} = event;
    console.log(`CSS Bounds: ${screenRectObject.width}x${screenRectObject.height}, Physical Resolution: ${pixelRectObject.width}x${pixelRectObject.height}`);
};
```

---

## 3. Multi-View System

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

## Next Steps

- **[Scene](./scene.md)**: Structure and configuration of `Scene`, where 3D objects and lights are placed
