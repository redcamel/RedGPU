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
`

const flowGraph = `
    Start(["Start"]) --> Init["RedGPU.init Initialization"] 
    Init -->|Success| Context["Obtain redGPUContext"]
    Context --> Create["Create Resources<br/>Scene, Camera, Mesh"]
    Create --> SetupView["Setup View3D"]
    SetupView --> StartLoop["Start Rendering Loop"]
    StartLoop -->|Loop| Update["Update Frame"]
    Update --> Render["Render Screen"]
    Render --> Update
`
</script>

# Getting Started

RedGPU is a high-performance 3D engine designed based on the next-generation web graphics standard, **WebGPU**. Through powerful **Compute Shader** utilization and low overhead, it provides native-level immersive graphics experiences in the web environment.

This guide walks you through the process of building your first 3D application using RedGPU step-by-step.

## 1. Prerequisites

Since WebGPU is a new technology, you need to check the execution environment below before starting.

- **Browser Support**: A modern browser that supports WebGPU, such as Chrome 113+ or Edge 113+, is required.
- **Check Support**: You can check the current browser and hardware's WebGPU support status at [WebGPU Report](https://webgpureport.org/).
- **Secure Context**: The WebGPU API only works in a secure environment (`https://`) or a local environment (`http://localhost`).

## 2. Installation

RedGPU can be integrated into your project immediately via ES Module (ESM) without any complex installation process.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. Implementing the First 3D Scene

Let's look at the core operation of RedGPU through the most basic form, a 'rotating cube'.

### HTML Structure (`index.html`)

Configure the `<canvas>` element where the rendering result will be displayed.

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

### JavaScript Implementation (`main.js`)

In RedGPU, the flow proceeds in the order of **Initialization** (Init) → **Resource Creation** (Scene/Camera/Mesh) → **View Setup** (View) → **Rendering Loop** (Start).

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. Initialize RedGPU system
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Upon successful initialization, the core redGPUContext object is delivered.

        // 2. Create Scene: Virtual space where 3D objects are placed
        const scene = new RedGPU.Display.Scene();

        // 3. Create Camera: Setup Perspective camera
        const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        camera.z = -5; // Move camera back from the origin

        // 4. Create Mesh: Combination of shape (Box) and material (Color)
        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        scene.addChild(mesh); // Add mesh to scene

        // 5. Setup View (View3D): Define to render a specific scene with a specific camera
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view); // Register view in context

        // 6. Run Renderer and start animation
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // Called every frame to implement animation.
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        // Handle initialization failure such as browser not supporting WebGPU
        console.error('RedGPU initialization failed:', error);
        alert('Could not initialize WebGPU. Please check your execution environment.');
    }
);
```

## Live Demo

Modify the code directly and check the results in real-time through the interactive example below.

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
        const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        camera.z = -5;

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

<br/>

## System Structure & Execution Flow

Diagram showing major class relationships and application lifecycle in RedGPU.

### Execution Process

<ClientOnly>
  <MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### Core Components

| Class | Role Definition |
| :--- | :--- |
| **`RedGPU.init`** | Requests WebGPU device permission and creates the core context. |
| **`RedGPU.Renderer`** | Manages the rendering loop that draws registered views to GPU hardware. |
| **`RedGPU.Display.Scene`** | The root container of the virtual space where 3D objects like meshes and lights are placed. |
| **`RedGPU.Display.View3D`** | The unit that determines which scene to output to the screen from which viewpoint (Camera). |

<ClientOnly>
  <MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## Next Steps

Now that you've learned basic screen composition, explore deeper features of RedGPU through the topics below.

- **[RedGPU Context](../context/index.md)**: Detailed configuration and options guide for engine context.
- **[Mesh](../basic-objects/mesh.md)**: How to create and control objects by combining geometry and material.
- **[Lighting & Shadow](../lighting-and-shadow/phong-material.md)**: Realistic texture and shadow expression reacting to light.
- **[Environment](../environment/skybox.md)**: How to set up Skybox and IBL.
- **[Extended Objects](../assets/model-loading/index.md)**: How to use external 3D models and sprites.
- **[API Reference](../../api/RedGPU-API/namespaces/RedGPU/README.md)**: Full class specification and technical documentation.
