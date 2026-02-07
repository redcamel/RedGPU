---
title: RedGPU Context
description: Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onSuccess Callback"]
        Callback -->|Obtain Instance| Setup["Scene and View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
`
</script>

# RedGPUContext

**RedGPUContext** is the object that serves as the foundation for the RedGPU engine. 
It handles the complex WebGPU initialization process and plays a central role in creating and managing various resources such as textures and models.

## 1. Role and Main Functions

RedGPUContext manages the overall state of the engine and provides the following functions:

- **Device Management**: Maintains the connection and handles communication between the browser and GPU hardware.
- **Resource Creation**: All 3D objects, such as meshes, textures, and materials, are created through this context.
- **Output Control**: Connected to the HTML canvas element to display rendered results on the screen.

## 2. Initialization Process

To build the WebGPU environment, call the `RedGPU.init` function to asynchronously create the context.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

```javascript
import * as RedGPU from "dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// Request RedGPU initialization
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Obtain RedGPUContext instance upon successful initialization.
        console.log('RedGPUContext ready:', redGPUContext);
    },
    (failReason) => {
        // Handle initialization failure (e.g., WebGPU not supported)
        console.error('Initialization failed:', failReason);
    }
);
```

## 3. Core Interface

### 3.1 View Registration and Management

Manages the list of **Views** (View3D) that determine what to draw on the screen. Created views must be registered in the context to be included in the actual rendering pipeline.

| Method | Description |
| :--- | :--- |
| `addView(view)` | Registers a view to render. |
| `removeView(view)` | Removes a registered view. |
| `viewList` | Returns a list of all currently registered views. |

### 3.2 Automatic Canvas Size Optimization

RedGPU automatically detects changes in the **Layout Size** of the canvas element. If the browser window size changes or the area occupied by the canvas changes due to CSS layout, the engine automatically resets the rendering resolution accordingly.

In this process, you can define an `onResize` callback to execute additional logic at the time of size change.

The `onResize` callback receives an `event` object as an argument, which contains `screenRectObject` (in CSS pixels) and `pixelRectObject` (in physical pixels) information.

```javascript
// Define callback to be called when size changes
redGPUContext.onResize = (event) => {
    const { width, height } = event.screenRectObject;
    console.log(`Canvas size changed (CSS): ${width}x${height}`);
    
    const { width: pWidth, height: pHeight } = event.pixelRectObject;
    console.log(`Canvas actual resolution: ${pWidth}x${pHeight}`);
    
    // Perform UI repositioning or camera property adjustments.
};
```

## 4. Necessity of Context Injection

Almost all objects in RedGPU require `redGPUContext` as the first argument upon creation.

This is because each object needs to know **"on which GPU device to create data"** to use GPU memory. By passing the context, the engine can correctly link objects with actual hardware resources.

```javascript
// [O] Correct way: Pass context upon creation.
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] Incorrect way: An error occurs if context is missing.
// const material = new RedGPU.Material.ColorMaterial(); 
```

## Key Summary

- **Engine Starting Point**: A required object created asynchronously via `RedGPU.init`.
- **Required Argument**: Must be injected when creating all graphic objects such as meshes or materials.
- **Integrated Manager**: Manages GPU device, canvas, and rendering views as one.

## Next Steps

You are ready to run the engine through RedGPUContext. But the screen is still empty.

Now it's time to learn how to compose the actual 3D world by placing a **Camera** on the empty canvas and defining a **Scene** to hold objects.

- **[View System](../view-system/)**
