---
title: RedGPU Context
description: Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onWebGPUInitialized Callback"]
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

`RedGPUContext` is the top-level context object that manages WebGPU device/adapter initialization, canvas resolution
control, the `View3D` container, and core engine managers.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
      // The redGPUContext instance is delivered upon RedGPU.init() success.
    },
        (error) => {
          console.error('RedGPU initialization failed:', error);
    }
);
```

> [!WARNING]
> `RedGPUContext` is created automatically inside `RedGPU.init()`.<br/>
> Do not instantiate it directly using the `new` keyword.

---

## 1. Initialization Process

Call `RedGPU.init()` to asynchronously initialize the WebGPU adapter and device and obtain the `RedGPUContext` instance.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

---

## 2. View Registration and Management

`RedGPUContext` acts as a container (`RedGPUContextViewContainer`) managing the list of `View3D` (and `View2D`)
instances to render on screen. Registered views are rendered sequentially in index order, allowing split-screen layouts,
Picture-in-Picture (PIP), and UI overlays.

- **`addView(view)` / `removeView(view)`**: Registers or removes a view for rendering.
- **`viewList` / `numViews`**: Queries the array of registered views (`View3D[]`) and their count.

> For index-based insertion (`addViewAt`), rendering order manipulation (`setViewIndex`, `swapViews`), and other
> container methods, refer to the `RedGPUContextViewContainer` API documentation.

---

## 3. Canvas Size and Resolution Control

Detects changes in the HTML canvas layout size (CSS pixels) and automatically updates the GPU rendering resolution.

- **`width` / `height`** (`number | string`): Gets or sets the canvas width and height (supports `'100%'`, `'800px'`,
  `600`, etc.).
- **`setSize(width, height)`**: Sets both width and height at once.
- **`renderScale`** (`number`, default: `1`): Rendering resolution multiplier. Can be lowered (e.g., `0.5 ~ 0.8`) to
  optimize performance on mobile or low-end devices.
- **`screenRectObject`** (`IRedGPURectObject`): Returns the canvas bounding rect `{ x, y, width, height }` in CSS
  pixels.
- **`pixelRectObject`** (`IRedGPURectObject`): Returns the actual physical pixel resolution `{ x, y, width, height }`
  with `devicePixelRatio` and `renderScale` applied.

### `onResize` Event Callback

Invoked whenever the canvas size changes, receiving a `RedResizeEvent<RedGPUContext>` object.

```javascript
redGPUContext.onResize = (event) => {
  const {width, height} = event.screenRectObject; // CSS pixels
  const {width: pWidth, height: pHeight} = event.pixelRectObject; // Physical pixels

  console.log(`CSS Size: ${width}x${height}, Physical Resolution: ${pWidth}x${pHeight}`);
};
```

---

## 4. Key Properties and Built-in Managers

Below are the configuration properties, 4 core managers, and native WebGPU objects owned by `RedGPUContext`.

| Property / Method           | Type                         | Description                                                                                                  |
|:----------------------------|:-----------------------------|:-------------------------------------------------------------------------------------------------------------|
| **`backgroundColor`**       | `ColorRGBA`                  | Default canvas background color (default: `0, 0, 0, 1`)                                                      |
| **`alphaMode`**             | `GPUCanvasAlphaMode`         | Canvas alpha compositing mode (`'premultiplied'` or `'opaque'`)                                              |
| **`antialiasingManager`**   | `AntialiasingManager`        | Centrally controls global antialiasing (`useTAA`, `useMSAA`, `useFXAA`) (Read-only)                          |
| **`resourceManager`**       | `ResourceManager`            | Centrally caches textures, buffers, shader modules, and bind group layouts and tracks GPU memory (Read-only) |
| **`commandEncoderManager`** | `CommandEncoderManager`      | Coordinates per-frame render/compute pass execution order and batch submission to the GPU queue (Read-only)  |
| **`detector`**              | `RedGPUContextDetector`      | Analyzes mobile status (`isMobile`), OS, browser engine, and WebGPU hardware `limits` (Read-only)            |
| **`keyboardKeyBuffer`**     | `{ [key: string]: boolean }` | Real-time buffer storing currently pressed keyboard keys                                                     |
| **`gpuDevice`**             | `GPUDevice`                  | WebGPU logical device object (Read-only)                                                                     |
| **`gpuAdapter`**            | `GPUAdapter`                 | Physical GPU adapter object (Read-only)                                                                      |
| **`gpuContext`**            | `GPUCanvasContext`           | WebGPU canvas context bound to the HTML canvas (Read-only)                                                   |
| **`htmlCanvas`**            | `HTMLCanvasElement`          | DOM `<canvas>` element used for rendering (Read-only)                                                        |
| **`destroy()`**             | `() => void`                 | Disposes of all GPU resources owned by the context and releases the device.                                  |

---

## 5. Necessity of Context Injection

All graphics resources and display objects in RedGPU (meshes, geometries, materials, textures, etc.) require
`redGPUContext` as their first constructor argument. This determines which `GPUDevice` and `ResourceManager` the object
belongs to when allocating GPU memory.

```javascript
// [O] Pass redGPUContext as the first constructor argument
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] Omitting the context throws an error
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## Related Examples

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [Multi Canvas](/RedGPU/examples/3d/multiCanvas/)

---

## Next Steps

- **[View System](../view-system/index.md)**: Combining `View3D`, `Scene`, and `Camera` to render a 3D stage on screen
