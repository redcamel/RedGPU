# Getting Started

RedGPU is a high-performance 3D engine built from the ground up on **WebGPU**, the next-generation web graphics API. This guide will walk you through the process of building your first 3D application using RedGPU.

## 1. Prerequisites

Since WebGPU is a cutting-edge technology, ensure you have the following before starting:

- **Browser Support**: Use a modern browser that supports WebGPU, such as Chrome 113+, Edge 113+, or Safari (Developer Preview).
- **Secure Context**: WebGPU API is only accessible over HTTPS (`https://`) or a local development environment (`http://localhost`).

## 2. Installation

You can integrate RedGPU into your project immediately using the distribution URL provided, without any separate installation process.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
```

## 3. Creating Your First 3D Scene

Let's explore how RedGPU works through the most basic example: a 'Rotating Cube'.

### HTML Structure (`index.html`)

A `<canvas>` element for rendering output and a module-based script connection are required.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedGPU - Quick Start</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
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

After asynchronous initialization via `init`, RedGPU follows a structure of configuring **Scene - Camera - Mesh** and outputting to the screen through **View3D**.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// 1. Initialize RedGPU system
RedGPU.init(
    canvas,
    (redContext) => {
        // 2. Create Scene: A virtual space where 3D objects are placed
        const scene = new RedGPU.Display.Scene(redContext);

        // 3. Create Camera: Setup a Perspective camera
        const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
        camera.z = -5; // Position the camera back from the origin

        // 4. Create Mesh: Define shape (Box) and appearance (Color)
        const geometry = new RedGPU.Primitive.Box(redContext); 
        const material = new RedGPU.Material.ColorMaterial(redContext, '#00CC99');
        const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
        
        scene.addChild(mesh); // Add the mesh to the scene

        // 5. Setup View (View3D): Combine a specific scene and camera to define a rendering area
        const view = new RedGPU.Display.View3D(redContext, scene, camera);
        redContext.addView(view);

        // 6. Create Renderer and start animation
        const renderer = new RedGPU.Renderer();
        renderer.start(redContext, (time) => {
            // Rotation animation applied every frame
            mesh.rotationX += 1;
            mesh.rotationY += 1;
        });
    },
    (error) => {
        console.error('RedGPU initialization failed:', error);
    }
);
```

## Live Demo

The demo below is an example running live via CodePen. You can check the results in the **Result** tab and modify the code directly by clicking the **JS** tab.

<ClientOnly>
<CodePen title="RedGPU Quick Start - Rotating Cube" slugHash="getting-started">
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

## Understanding Core Components

| Core Class | Description |
| :--- | :--- |
| **`RedGPU.init`** | Activates the WebGPU system and creates the engine's core context. |
| **`RedGPU.Renderer`** | Responsible for physically drawing registered views to the GPU. |
| **`RedGPU.Display.Scene`** | The root container for the 3D space where meshes, lights, etc., are placed. |
| **`RedGPU.Display.View3D`** | Defines a screen unit that determines which scene is rendered with which camera. |
| **`RedGPU.Display.Mesh`** | A visible object that combines geometry (shape) and material (appearance). |

<script setup>
const mermaidGraph = `
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
</script>

<ClientOnly>
<MermaidResponsive :definition="mermaidGraph" />
</ClientOnly>

## Recommended Next Steps

- **[RedGPU Context](../core-concepts/redgpu-context.md)**: Detailed guide on context management and configuration options.
- **[Basic Geometry](../core-concepts/geometry.md)**: How to create basic shapes and use parameters.
- **[API Reference](../../api/index.md)**: Full class specifications.
