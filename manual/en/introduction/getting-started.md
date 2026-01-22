# Getting Started

RedGPU is a high-performance 3D engine built from the ground up on **WebGPU**, the next-generation web graphics standard. By leveraging powerful Compute Shaders and maintaining low overhead, it delivers a rich, native-like graphics experience directly in the web browser.

This guide will walk you through the step-by-step process of building your first 3D application using RedGPU.

## 1. Prerequisites

Since WebGPU is a cutting-edge technology, ensure your environment meets the following requirements:

- **Browser Support**: Use a modern browser that supports WebGPU, such as Chrome 113+ or Edge 113+.
- **Check Support**: You can verify your browser and hardware's WebGPU support status at [WebGPU Report](https://webgpureport.org/).
- **Secure Context**: The WebGPU API is only accessible over HTTPS (`https://`) or a local development environment (`http://localhost`).

## 2. Installation

RedGPU can be integrated into your project immediately via ES Module (ESM), without any complex installation process.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. Creating Your First 3D Scene

Let's explore the core mechanics of RedGPU through a basic 'Rotating Cube' example.

### HTML Structure (`index.html`)

Prepare a `<canvas>` element where the rendering output will be displayed.

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

The RedGPU workflow follows a sequence of: **Initialization (Init)** → **Resource Creation (Scene/Camera/Mesh)** → **View Configuration (View)** → **Rendering Loop (Start)**.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. Initialize RedGPU system
RedGPU.init(
    canvas,
    (redContext) => {
        // On success, the core redContext object is passed to the callback.

        // 2. Create Scene: A virtual space to place 3D objects
        const scene = new RedGPU.Display.Scene(redContext);

        // 3. Create Camera: Setup a Perspective projection camera
        const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
        camera.z = -5; // Move the camera back from the origin

        // 4. Create Mesh: A combination of Geometry (shape) and Material (appearance)
        const geometry = new RedGPU.Primitive.Box(redContext); 
        const material = new RedGPU.Material.ColorMaterial(redContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
        
        scene.addChild(mesh); // Add the mesh to the scene

        // 5. Setup View (View3D): Define which scene to render with which camera
        const view = new RedGPU.Display.View3D(redContext, scene, camera);
        redContext.addView(view); // Register the view to the context

        // 6. Create Renderer and start the animation loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redContext, (time) => {
            // This function is called every frame to handle animations
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        // Handle initialization failures (e.g., WebGPU not supported)
        console.error('RedGPU initialization failed:', error);
        alert('Failed to initialize WebGPU. Please check your browser environment.');
    }
);
```

## Live Demo

Interact with the code below to see the results in real-time.

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
    (redContext) => {
        const scene = new RedGPU.Display.Scene(redContext);
        const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
        camera.z = -5;

        const geometry = new RedGPU.Primitive.Box(redContext); 
        const material = new RedGPU.Material.ColorMaterial(redContext, "#00CC99");
        const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
        
        scene.addChild(mesh);

        const view = new RedGPU.Display.View3D(redContext, scene, camera);
        redContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redContext, (time) => {
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

## System Architecture & Flow

The following diagrams illustrate the relationship between major classes and the application lifecycle in RedGPU.

### Execution Flow

<script setup>
const systemGraph = `
    Renderer[RedGPU.Renderer] -->|Draws| View[RedGPU.Display.View3D]
    View -->|Composes| Scene[RedGPU.Display.Scene]
    View -->|Uses| Camera[RedGPU.Camera]
    Scene -->|Contains| Mesh[RedGPU.Display.Mesh]
    Mesh -->|Combines| Geo[Geometry] & Mat[Material]

    %% Apply Custom Classes
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`

const flowGraph = `
    Start([Start]) --> Init[RedGPU.init Initialization]
    Init -->|Success| Context[Obtain RedContext]
    Context --> Create[Create Resources<br/>Scene, Camera, Mesh]
    Create --> SetupView[Configure View3D]
    SetupView --> StartLoop[Start Rendering Loop]
    StartLoop -->|Loop| Update[Update Frame]
    Update --> Render[Draw Frame]
    Render --> Update
`
</script>

<ClientOnly>
<MermaidResponsive :definition="flowGraph" />
</ClientOnly>

### Core Components

| Class | Role Definition |
| :--- | :--- |
| **`RedGPU.init`** | Requests WebGPU device permissions and creates the engine's core `RedGPUContext`. |
| **`RedGPU.Renderer`** | Manages the rendering loop that draws registered views to the GPU hardware. |
| **`RedGPU.Display.Scene`** | The root container for the 3D space where meshes, lights, and other objects reside. |
| **`RedGPU.Display.View3D`** | Defines which scene is rendered from which camera perspective to the screen. |

<ClientOnly>
<MermaidResponsive :definition="systemGraph" />
</ClientOnly>

## Next Steps

Now that you've built your first scene, explore more powerful features of RedGPU through these topics:

- **[RedGPU Context](../core-concepts/redgpu-context.md)**: A guide to engine context settings and advanced options.
- **[Mesh](../core-concepts/mesh.md)**: How to create and control objects by combining geometry and material.
- **[Material](../basic-objects/texture.md)**: How to express texture and color using materials.
- **[Environment](../environment/skybox.md)**: How to set up Skybox and IBL.
- **[Post-Effect](../post-effect/intro.md)**: How to apply post-processing effects like Bloom and SSAO.
- **[API Reference](../../api/index.md)**: Full class specifications and technical documentation.