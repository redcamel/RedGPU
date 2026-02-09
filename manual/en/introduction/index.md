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

    %% Apply custom classes
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
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
`
</script>

# Getting Started

RedGPU is a high-performance 3D engine built on **WebGPU**, the next-generation web graphics standard. By leveraging powerful **Compute Shaders** and maintaining low overhead, it delivers native-level immersive graphics experiences directly in the web browser.

This guide will walk you through the process of building your first 3D application using RedGPU step-by-step.

## 1. Prerequisites

Since WebGPU is a cutting-edge technology, ensure your execution environment meets the following requirements:

- **Browser Support**: A modern browser that supports WebGPU, such as Chrome 113+ or Edge 113+, is required.
- **Verify Support**: You can check your browser and hardware's current WebGPU support status at [WebGPU Report](https://webgpureport.org/).
- **Secure Context**: The WebGPU API is only accessible in a secure environment (`https://`) or a local development environment (`http://localhost`).

## 2. Installation

RedGPU can be integrated into your project immediately via ES Module (ESM), without any complex installation process.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. Creating Your First 3D Scene

Let's explore the core mechanics of RedGPU through a basic 'Rotating Cube' example.

### HTML Structure (`index.html`)

Configure the `<canvas>` element where the rendering output will be displayed.

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

In RedGPU, the workflow follows this sequence: **Initialization (Init)** → **Resource Creation (Scene/Camera/Mesh)** → **View Setup (View)** → **Rendering Loop (Start)**.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. Initialize the RedGPU system
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Upon successful initialization, the core redGPUContext object is delivered.

        // 2. Create a Scene: A virtual space where 3D objects are placed
        const scene = new RedGPU.Display.Scene();

        // 3. Create a Camera: Set up a Perspective projection camera
        const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        camera.z = -5; // Move the camera back from the origin

        // 4. Create a Mesh: A combination of a shape (Box) and a material (Color)
        const geometry = new RedGPU.Primitive.Box(redGPUContext); 
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        
        scene.addChild(mesh); // Add the mesh to the scene

        // 5. Set up a View (View3D): Define which scene to render with which camera
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        redGPUContext.addView(view); // Register the view with the context

        // 6. Run the Renderer and start the animation
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // This function is called every frame to handle animations.
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

Modify the code directly and see the results in real-time through the interactive example below.

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

## System Architecture & Execution Flow

This diagram illustrates the relationships between major classes and the application lifecycle in RedGPU.

### Execution Process

<ClientOnly>
  <MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### Core Components

| Class | Role Definition |
| :--- | :--- |
| **`RedGPU.init`** | Requests WebGPU device permission and creates the engine's core context. |
| **`RedGPU.Renderer`** | Manages the rendering loop that draws registered views to the GPU hardware. |
| **`RedGPU.Display.Scene`** | The root container for the virtual 3D space where meshes, lights, and other objects reside. |
| **`RedGPU.Display.View3D`** | The unit that determines which scene is rendered from which viewpoint (Camera) to the screen. |

<ClientOnly>
  <MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## Next Steps

Now that you've learned basic screen composition, explore the more powerful features of RedGPU through these topics:

- **[RedGPU Context](../context/index.md)**: A detailed guide to engine context settings and advanced options.
- **[Mesh](../basic-objects/mesh.md)**: How to create and control objects by combining geometry and material.
- **[Lighting & Shadow](../lighting-and-shadow/phong-material.md)**: Realistic texture and shadow expression reacting to light.
- **[Environment](../environment/skybox.md)**: How to set up Skybox and IBL.
- **[Extended Objects](../assets/model-loading/index.md)**: How to use external 3D models and sprites.
- **[API Reference](../../api/RedGPU-API/namespaces/RedGPU/README.md)**: Full class specifications and technical documentation.