---
title: RedGPU Context
description: Learn about RedGPUContext, the entry point and resource manager of the RedGPU engine.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onWebGPUInitialized Callback"]
        Callback -->|Acquire Instance| Setup["Scene & View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
        
        %% Grayscale styles applied
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`
</script>

# RedGPUContext

`RedGPUContext` is the top-level context object that serves as the foundation for running the RedGPU engine. It handles
the complex WebGPU initialization process behind the scenes and plays a central role in managing the device, adapter,
canvas, resources, and core engine managers required for rendering.

> [!WARNING]
> `RedGPUContext` is instantiated automatically internally via `RedGPU.init()`.<br/>
> Do not instantiate it directly using the `new` keyword.

---

## 1. Architecture and Role

Call `RedGPU.init()` to asynchronously initialize the WebGPU adapter and device and acquire the `RedGPUContext`
instance.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

`RedGPUContext` manages the overall engine state and performs the following core roles:

- **View Container Management**: Manages the list of `View3D` (and `View2D`) instances to render (`addView`,
  `removeView`), supporting split-screen layouts and UI overlays via multi-view rendering.
- **Canvas Size & Resolution Control**: Automatically detects HTML `<canvas>` size changes (`onResize`) and controls the
  rendering resolution multiplier (`renderScale`) and default background color (`backgroundColor`).
- **Built-in Core Managers**: Provides built-in managers for antialiasing (`antialiasingManager`), GPU resource caching
  (`resourceManager`), command encoding (`commandEncoderManager`), and hardware environment detection (`detector`).
- **Global Input Buffering**: Provides `keyboardKeyBuffer` to track real-time keyboard key press states.

---

## 2. Basic Initialization Usage

To set up the WebGPU environment, pass the target `<canvas>` element along with success and failure callbacks to
`RedGPU.init()`.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Acquire the redGPUContext instance upon successful initialization
        console.log('RedGPUContext ready:', redGPUContext);

        // Configure default background color
        redGPUContext.backgroundColor.setColorByHEX('#000000');
    },
    (error) => {
        // Handle initialization failure (e.g., unsupported WebGPU environment)
        console.error('RedGPU initialization failed:', error);
    }
);
```

---

## 3. Size and Resolution Management

`RedGPUContext` detects layout dimension changes (in CSS pixels) on the HTML canvas element and automatically optimizes
the rendering resolution.

### Key Properties and Methods

- **`width` / `height`** (`number | string`): Gets or sets the canvas width and height directly. Supports formats such
  as `'100%'`, `'800px'`, and `600`.
- **`setSize(width, height)`**: Sets both width and height at once.
- **`renderScale`** (`number`): Determines the rendering resolution multiplier. Defaults to `1`, and can be adjusted to
  values like `0.5` to optimize performance on mobile devices.
- **`screenRectObject`** (`IRedGPURectObject`): Provides the canvas bounding rect `{ x, y, width, height }` in CSS
  pixels.
- **`pixelRectObject`** (`IRedGPURectObject`): Provides the actual physical rendering resolution
  `{ x, y, width, height }` in physical pixels.

### `onResize` Event Callback

When the canvas is resized or `setSize()` is called, you can register an `onResize` callback to perform additional
operations such as repositioning UI layouts. The `event` parameter conforms to the `RedResizeEvent<RedGPUContext>`
interface.

```javascript
redGPUContext.onResize = (event) => {
    // event.target points to the RedGPUContext instance.
    const {width, height} = event.screenRectObject; // In CSS pixels
    const {width: pWidth, height: pHeight} = event.pixelRectObject; // In physical pixels

    console.log(`CSS Size: ${width}x${height}, Physical Resolution: ${pWidth}x${pHeight}`);
};
```

---

## 4. Why Context Injection Is Required

Nearly all 3D objects in RedGPU (meshes, geometries, textures, materials, etc.) require `redGPUContext` as their first
constructor argument.

Because each graphics object must dynamically allocate GPU memory, `RedGPUContext` serves as the reference that
determines **which GPU device (`gpuDevice`) and resource manager (`resourceManager`)** will create and manage those
resources.

```javascript
// [O] Correct: Always pass redGPUContext as the first argument
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] Incorrect: Omitting the context throws an error
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## Related Examples

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [Multi Canvas](/RedGPU/examples/3d/multiCanvas/)

---

## Next Steps

With `RedGPUContext`, the engine is ready to run. Now let's learn how to place a **camera** (`Camera`) on the blank
canvas and define a **scene** (`Scene`) to hold objects and render a 3D world on screen.

- **[View System](../view-system/index.md)**: Combining `View3D`, `Scene`, and `Camera` to render a 3D stage on screen
