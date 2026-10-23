---
title: Getting Started
order: 1
---
<script setup>
const systemGraph = `
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]

    %% Grayscale styles applied
    style Renderer fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Geo fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mat fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`

const flowGraph = `
    Start(["Start"]) --> Init["RedGPU.init Initialization"] 
    Init -->|Success| Context["Obtain redGPUContext"]
    Context --> Create["Create Resources<br/>Scene, Camera, Mesh"]
    Create --> SetupView["Setup View3D"]
    SetupView --> StartLoop["Start Rendering Loop"]
    StartLoop -->|Loop| Update["Frame Update"]
    Update --> Render["Render Screen"]
    Render --> Update

    %% Grayscale styles applied
    style Start fill:#fafafa,stroke:#d4d4d8,color:#52525b,stroke-width:1px
    style Init fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Context fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Create fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style SetupView fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style StartLoop fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Update fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Render fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Getting Started

**RedGPU** is a **WebGPU**-based web 3D graphics engine. This section covers the baseline workflow from canvas
initialization to rendering your first 3D mesh on the screen.

## 1. Prerequisites

Check the following WebGPU runtime requirements before starting:

- **Browser Support**: Requires a WebGPU-enabled browser such as Chrome 113+, Edge 113+, Safari 26+, or Firefox 141+.
- **Verify Support**: You can check your browser and hardware's current WebGPU support status at [WebGPU Report](https://webgpureport.org/).
- **Secure Context**: The WebGPU API is only accessible in a secure environment (`https://`) or a local development environment (`http://localhost`).

## 2. Installation

RedGPU can be imported directly via **ES Module** (ESM) without any build tools or package installation.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. System Architecture & Execution Flow

### Execution Process

<ClientOnly>
  <MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### Core Components

| Class                       | Role Definition                                                                |
|:----------------------------|:-------------------------------------------------------------------------------|
| **`RedGPU.init`**           | Requests WebGPU device permission and creates `RedGPUContext`.                 |
| **`RedGPU.Renderer`**       | Controls the loop that renders registered views on the GPU each frame.         |
| **`RedGPU.Display.Scene`**  | Root container where 3D objects such as meshes and lights are placed.          |
| **`RedGPU.Display.View3D`** | Viewport unit that outputs a specific `Scene` from a given `Camera` viewpoint. |

<ClientOnly>
  <MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## 4. Creating Your First 3D Scene

Using a rotating cube example, configure the standard workflow: **Initialization** (Init) → **Resource Creation**
(Scene/Camera/Mesh) → **View Setup** (View) → **Rendering Loop** (Start).

### HTML Structure

Place the `<canvas>` element where the rendered result will be displayed.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedGPU - Quick Start</title>
    <style>
        body { margin: 0; overflow: hidden; background: #111; }
        canvas { display: block; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <canvas id="redgpu-canvas"></canvas>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### JavaScript Implementation

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. Initialize the RedGPU system
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 2. Create a Scene: Space where 3D objects are placed
        const scene = new RedGPU.Display.Scene();

        // 3. Create a Camera: Set up a Perspective projection camera
        const camera = new RedGPU.Camera.PerspectiveCamera();
        camera.z = -5;
        camera.lookAt(0, 0, 0);

        // 4. Create a Mesh: Combine geometry (Box) and material (Color)
        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

        scene.addChild(mesh);

        // 5. Set up a View (View3D) and register it with the context
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view);

        // 6. Start the Renderer frame loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        // Handle initialization failures (e.g., WebGPU not supported)
        console.error('RedGPU initialization failed:', error);
        alert('Could not initialize WebGPU. Please check your browser and hardware environment.');
    }
);
```

## Live Demo

<ClientOnly>
  <CodePen title="RedGPU Quick Start - Rotating Cube" slugHash="getting-started">
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
        const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera ();
        camera.z = -5;
camera.lookAt (0, 0, 0);

        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        scene.addChild(mesh);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        console.error("RedGPU initialization failed:", error);
    }
);
</pre>
  </CodePen>
</ClientOnly>

---

## Related Examples

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [Hello World 2D](/RedGPU/examples/2d/helloWorld2D/)

---

## Next Steps

- **[RedGPU Context](../context/index.md)**: Detailed engine context configuration and options
- **[View System](../view-system/index.md)**: Rendering viewports, scenes, and camera configuration
- **[Basic Objects](../basic-objects/index.md)**: Creating and controlling meshes, hierarchies, and textures
- **[Lighting & Shadow](../lighting-and-shadow/index.md)**: Lights, materials, and shadow rendering
- **[Environment](../environment/index.md)**: Skybox, IBL, atmospheric scattering, and global wind settings
- **[Extended Objects](../extended-objects/index.md)**: External 3D models, instancing, sprites, and particles
- **[Inspector](../inspector/index.md)**: Performance profiling and real-time scene debugging tool
