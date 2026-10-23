---
order: 1
---

<script setup>
const skyboxGraph = `
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% Grayscale styles applied
    style HDRSource fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Images fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style CubeTex fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Skybox fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View3D fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`
</script>

# Skybox

`SkyBox` is a display object that renders an infinite 360-degree background in 3D space.
Unlike standard meshes, it is assigned directly to the `skybox` property of a `View3D` rather than added to a `Scene`.

```javascript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, texture);
view.skybox = skybox;
```

---

## 1. Texture Creation Comparison

Textures for `SkyBox` can be generated via `IBL` or created as a `CubeTexture` combining 6 directional images.

<ClientOnly>
  <MermaidResponsive :definition="skyboxGraph" />
</ClientOnly>

| Category          | Using IBL                                   | Using CubeTexture                                        |
|:------------------|:--------------------------------------------|:---------------------------------------------------------|
| **Source**        | 1 HDR panorama image (`.hdr`)               | 6 standard directional images (`px, nx, py, ny, pz, nz`) |
| **Texture Type**  | `IBLCubeTexture` (`ibl.environmentTexture`) | `CubeTexture`                                            |
| **Lighting Data** | Yes (Auto-generates diffuse/specular maps)  | No                                                       |
| **Primary Usage** | Background + PBR lighting (Recommended)     | Simple visual background                                 |

### 1.1 Using IBL Resources

Creating a `RedGPU.Resource.IBL` instance automatically converts a 2D HDR panorama image into a cubemap
`environmentTexture` while generating physically based lighting data that matches the background.

> [!NOTE]
> To use a single HDR (`.hdr`) panorama image as a skybox, you must pass it through `IBL` to convert it into a cubemap.

```javascript
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

### 1.2 Using CubeTexture

Combines 6 standard images (JPG, PNG, etc.) representing the six faces of a cube into a `CubeTexture`. The image array
must be passed in the exact order: **`px, nx, py, ny, pz, nz`**.

```javascript
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    './posx.jpg', './negx.jpg', 
    './posy.jpg', './negy.jpg', 
    './posz.jpg', './negz.jpg'
]);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
```

---

## 2. Live Demo

### A. IBL Method

<ClientOnly>
<CodePen title="RedGPU Basics - Skybox (IBL)" slugHash="skybox-ibl">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create IBL and Apply SkyBox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

### B. CubeTexture Method

<ClientOnly>
<CodePen title="RedGPU Basics - Skybox (CubeMap)" slugHash="skybox-cubemap">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // Create CubeTexture (Order: px, nx, py, ny, pz, nz)
    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/px.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nx.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/py.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/ny.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/pz.jpg',
        'https://redcamel.github.io/RedGPU/examples/assets/skybox/nz.jpg'
    ]);
    
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[IBL](./ibl.md)**: Applying realistic reflections and lighting to objects using background images as physically
  based light sources
