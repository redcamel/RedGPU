---
title: RedGPU Context
description: Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onSuccess Callback"]
        Callback -->|Get Instance| Setup["Scene & View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
        
        %% Grayscale styles applied
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`
</script>

# RedGPUContext

**RedGPUContext** is the top-level core context object upon which the RedGPU engine operates. It handles the complex
WebGPU initialization process and plays a central role in managing various manager objects required for devices,
adapters, canvas, resources, and rendering.

> [!WARNING]
> `RedGPUContext` is created internally by `RedGPU.init()`.<br/>
> Do not create an instance directly using the `new` keyword.

---

## 1. Role and Main Functions

RedGPUContext manages the overall state of the engine and provides the following functions:

| Function Category                                    | Description                                                                                                                                        |
|:-----------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Device & Adapter Management**                      | Controls communication and computational resources between the browser and GPU hardware.                                                           |
| **Canvas Size & Scale Control**                      | Flexibly adjusts the actual physical resolution of the canvas, CSS pixel resolution, and rendering scale ( `renderScale` ).                        |
| **Resource Control**                                 | Provides `resourceManager` to integrate and manage GPU resources such as textures, meshes, materials, and buffers.                                 |
| **Rendering Quality Control**                        | You can utilize `antialiasingManager` which manages MSAA, FXAA, and TAA settings to prevent aliasing.                                              |
| **Command Optimization & Pass Lifecycle Management** | Provides `commandEncoderManager` for safe and efficient batch recording and submission of GPU commands.                                            |
| **Event Buffering**                                  | Supports real-time canvas resizing detection ( `onResize` ), mouse/touch coordinate picking, and keyboard input buffering ( `keyboardKeyBuffer` ). |

---

## 2. Process of Initialization

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
        
        // Set background color to black
        redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
    },
    (failReason) => {
        // Handle initialization failure (e.g., WebGPU not supported)
        console.error('Initialization failed:', failReason);
    }
);
```

---

## 3. Core API Specification

### 3.1 View Registration and Management

`RedGPUContext` manages the list of **[View3D](../api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.md)
** objects to determine what to draw on the screen. Registered views are processed in order within the rendering
pipeline.
This interface is implemented by inheriting `RedGPUContextViewContainer`.

| Method / Property             | Description                                                                      |
|:------------------------------|:---------------------------------------------------------------------------------|
| `viewList`                    | Returns a list of all registered views. (Read-only, `View3D[]`)                  |
| `numViews`                    | The number of views currently owned by the container. (Read-only, `number`)      |
| `addView(view)`               | Registers a view for rendering.                                                  |
| `addViewAt(view, index)`      | Adds a view at a specific index.                                                 |
| `removeView(view)`            | Removes a registered view.                                                       |
| `removeViewAt(index)`         | Removes a view at a specific index.                                              |
| `removeAllViews()`            | Removes all registered views.                                                    |
| `getViewAt(index)`            | Returns the view at the specified index. (`View3D`)                              |
| `getViewIndex(view)`          | Returns the index of a specific view. (`number`)                                 |
| `setViewIndex(view, index)`   | Changes the rendering order (index) of a registered view.                        |
| `swapViews(view1, view2)`     | Swaps the rendering positions of two views.                                      |
| `swapViewsAt(index1, index2)` | Swaps two views at the specified indices.                                        |
| `contains(view)`              | Checks if the specified view is currently registered in the context. (`boolean`) |

---

### 3.2 Canvas Size and Resolution Optimization

RedGPUContext detects changes in the canvas layout size (in CSS pixels) and automatically optimizes the rendering
resolution.

#### Key Properties & Methods

- **`width` / `height`** (`number | string`): You can get or set the canvas width and height directly. Supports formats
  like `'100%'`, `'800px'`, and `600`.
- **`setSize(width, height)`**: Sets both width and height at once.
- **`renderScale`** (`number`): Determines the rendering resolution scale. The default is `1`. You can reduce it to
  `0.5` to lower the resolution for performance optimization on mobile devices.
- **`screenRectObject`** (`IRedGPURectObject`): Provides the canvas area `{ x, y, width, height }` in CSS pixels.
- **`pixelRectObject`** (`IRedGPURectObject`): Provides the actual rendering resolution `{ x, y, width, height }` in
  physical pixels.

#### `onResize` Event Callback

When the canvas size is adjusted or `setSize` is called and the size changes, you can register an `onResize` callback to
perform additional computations such as changing the camera aspect ratio. The `event` argument passed to the callback
follows the `RedResizeEvent<RedGPUContext>` interface.

```javascript
redGPUContext.onResize = (event) => {
    // event.target points to the RedGPUContext instance.
    const { width, height } = event.screenRectObject; // in CSS pixels
    const { width: pWidth, height: pHeight } = event.pixelRectObject; // in physical pixels
    
    console.log(`CSS Size: ${width}x${height}, Actual Physical Resolution: ${pWidth}x${pHeight}`);
    
    // Example: When you want to update the camera aspect ratio for current views
    redGPUContext.viewList.forEach((view) => {
        view.camera.aspect = width / height;
    });
};
```

---

### 3.3 Properties

| Property Name           | Type                                                                                                                             | Description                                                                          |
|:------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|
| `backgroundColor`       | [ColorRGBA](../api/RedGPU-API/namespaces/RedGPU/namespaces/Color/classes/ColorRGBA.md)                                           | Determines the canvas background color. (Default: Black `0, 0, 0, 1`)                |
| `alphaMode`             | `GPUCanvasAlphaMode`                                                                                                             | Controls the canvas alpha blending mode (`'opaque'` or `'premultiplied'`).           |
| `keyboardKeyBuffer`     | `{ [key: string]: boolean }`                                                                                                     | A real-time buffer of currently active (pressed) keyboard keys.                      |
| `detector`              | [RedGPUContextDetector](../api/RedGPU-API/namespaces/RedGPU/namespaces/Context/namespaces/Core/classes/RedGPUContextDetector.md) | Detects user device environments such as mobile usage and browser specs. (Read-only) |
| `resourceManager`       | [ResourceManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/namespaces/Core/classes/ResourceManager.md)            | Registers and caches GPU resources and manages memory lifecycles. (Read-only)        |
| `antialiasingManager`   | [AntialiasingManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Antialiasing/classes/AntialiasingManager.md)                | Controls engine-wide anti-aliasing (MSAA, etc.) settings. (Read-only)                |
| `commandEncoderManager` | [CommandEncoderManager](../api/RedGPU-API/namespaces/RedGPU/classes/CommandEncoderManager.md)                                    | An encoder manager that records and submits GPU commands. (Read-only)                |
| `gpuDevice`             | `GPUDevice`                                                                                                                      | The core logical device object of WebGPU. (Read-only)                                |
| `gpuAdapter`            | `GPUAdapter`                                                                                                                     | The physical GPU hardware information object. (Read-only)                            |
| `gpuContext`            | `GPUCanvasContext`                                                                                                               | The WebGPU canvas context connected to the HTML canvas. (Read-only)                  |
| `htmlCanvas`            | `HTMLCanvasElement`                                                                                                              | The actual DOM canvas element being used for rendering. (Read-only)                  |

#### Other Methods

- **`destroy()`** : Disposes of all WebGPU resources and releases the connected GPU device.

---

### 3.4 Key Managers

RedGPUContext owns **4 key manager** instances designed for specific purposes to ensure stable and efficient resource
utilization throughout the engine.

#### 1) Resource Manager (`resourceManager`)

- **Type
  **: [ResourceManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/namespaces/Core/classes/ResourceManager.md)
- **Role**: Integrates and caches WebGPU shader modules, buffers, bind group layouts, texture views, and resource
  states.
- **Key Features**:
    - `createGPUShaderModule(name, descriptor)` / `getGPUShaderModule(name)` : Creates and retrieves shaders processed
      by the WGSL preprocessor.
    - `createBindGroupLayout(name, descriptor)` / `getGPUBindGroupLayout(name)` : Manages bind group layout caching.
    - `getGPUResourceBitmapTextureView(texture)` / `getGPUResourceCubeTextureView(cubeTexture)` : Performance
      optimization through texture view caching and reuse.
    - Provides generators responsible for IBL (Image-Based Lighting) and mipmap creation ( `brdfGenerator`,
      `mipmapGenerator`, etc.).
    - Provides default and displacement samplers shared across the engine ( `basicSampler`,
      `basicDisplacementSampler` ).

#### 2) Device & Browser Environment Detector (`detector`)

- **Type
  **: [RedGPUContextDetector](../api/RedGPU-API/namespaces/RedGPU/namespaces/Context/namespaces/Core/classes/RedGPUContextDetector.md)
- **Role**: Analyzes the hardware specs, platforms, browser engines, and WebGPU limits (Limits/Features) of the user
  device.
- **Key Features**:
    - Mobile and OS type detection ( `isMobile`, `isIOS`, `isAndroid` ).
    - Browser engine detection ( `isChromium`, `isSafari`, `isFirefox` ).
    - Query device information ( `hardwareConcurrency` core count, `deviceMemory` memory size).
    - Generates detailed WebGPU support profile reports ( `toReport()` ).

#### 3) Anti-aliasing Manager (`antialiasingManager`)

- **Type
  **: [AntialiasingManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Antialiasing/classes/AntialiasingManager.md)
- **Role**: Centrally controls the anti-aliasing method used in the rendering pipeline to prevent jaggy edges.
- **Key Features**:
    - Enable multi-sampling ( `useMSAA` ).
    - Enable fast approximate anti-aliasing ( `useFXAA` ).
    - Enable temporal anti-aliasing ( `useTAA` ).
    - Intelligently auto-selects the default mode based on the device's pixel density ( `devicePixelRatio` ).

#### 4) Command Encoder Manager (`commandEncoderManager`)

- **Type**: [CommandEncoderManager](../api/RedGPU-API/namespaces/RedGPU/classes/CommandEncoderManager.md)
- **Role**: Manages the lifecycle of `GPUCommandEncoder` and render/compute passes stage-by-stage to maximize execution
  efficiency.
- **Note**: This class is initialized automatically within the system and should not be created directly using the `new`
  keyword.
- **Key Features**:
    - Batch registration and optimization of stage-specific passes ( `Resource` -> `PreProcess` -> `Main` ->
      `PostProcess` ).
    - Automatically creates separate encoders if nested calls occur while a pass is active to ensure safety.
    - Immediate execution and submission support ( `immediateRenderPass`, `immediateComputePass`, `immediateSubmit` ).
    - Provides deferred destruction ( `addDeferredDestroy` ) to release GPU resources at a safe point after commands
      finish.
    - Single queue submission ( `submitAll()` ) and real-time stage-by-stage rendering statistics reporting.

---

## 4. Necessity of Context Injection

Almost all 3D objects in RedGPU (meshes, geometries, textures, materials, etc.) require `redGPUContext` as the first
argument of the constructor.

Each graphics object must be dynamically allocated GPU memory, and the connection baseline for **"which GPU
device ( `gpuDevice` ) should be used to create the resource"** is the `RedGPUContext`.

```javascript
// [O] Correct way: Always inject context as the first argument upon creation.
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] Incorrect way: An error occurs if context is not passed.
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## Key Summary

- **Engine Control Tower**: Prepared asynchronously via `RedGPU.init` and manages device, adapter, and canvas in an
  integrated manner.
- **Parent Container**: Registers and manipulates multiple `View3D` objects to enable layered rendering.
- **Resource Standard**: Used as the creation standard for all generated graphic resources (buffers, materials,
  textures), making it a required injection target.
- **Size & Scale Control**: Automatically updates the resolution in response to canvas size changes and provides easy
  scale adjustments.

---

## Next Steps

You are ready to run the engine through RedGPUContext. However, the screen is still empty.

Now it's time to learn how to compose the actual 3D world by placing a **Camera** on the empty canvas and defining a **Scene** to hold objects.

- **[Screen Configuration](../view-system/)**