---
order: 1
---

<script setup>
const skyboxGraph = `
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    HDRSource -->|new| HDRTex["RedGPU.Resource.HDRTexture"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    HDRTex --> Skybox
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]
`
</script>

# Skybox

Skybox is a technique for representing an infinite background in 3D space. It is rendered by creating a **SkyBox** object and assigning it to the `skybox` property of the camera view (**View3D**).

## 1. Basic Usage

Unlike general meshes, SkyBox is not added to the Scene but is connected directly to **View3D**.

```javascript
// 1. Create SkyBox (Texture required)
const skybox = new RedGPU.Display.SkyBox(redGPUContext, texture);

// 2. Apply to View (Required)
view.skybox = skybox;
```

## 2. Texture Creation Methods

There are three main methods for creating textures to be applied to a SkyBox. We'll look at them from **IBL**, the most recommended method, to traditional **CubeMap**.

<ClientOnly>
  <MermaidResponsive :definition="skyboxGraph" />
</ClientOnly>

### 2.1 Using IBL Resource (Recommended)

When a `RedGPU.Resource.IBL` object is created, an **Environment Texture** is automatically created internally. This method utilizes that texture for the Skybox.

- **Pros**: You get Physically Based Lighting (Diffuse/Specular) data that perfectly matches the background.
- **Usage**: A modern method mainly used to obtain the most realistic rendering results.

```javascript
// Create IBL (Lighting data + background texture created)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// Use environmentTexture inside IBL as Skybox
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

### 2.2 Single HDR Image (HDRTexture)

A method of loading a single HDR panorama image to create an `HDRTexture` and applying it directly to the Skybox.

- **Pros**: You can configure a high-quality background with just a single image.
- **Features**: It is used simply as a background and does not automatically calculate global lighting (IBL) data for the entire scene.

```javascript
const hdrTexture = new RedGPU.Resource.HDRTexture(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, hdrTexture);
```

### 2.3 6 Images (CubeTexture)

A traditional method of combining 6 standard images (JPG, PNG, etc.) for top, bottom, left, right, front, and back to create a `CubeTexture`. The image array must be passed in the order: **px, nx, py, ny, pz, nz**.

- **Pros**: Resources are easy to obtain and intuitive.
- **Cons**: It is difficult to expect realistic light effects as it does not contain HDR information.

```javascript
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    './posx.jpg', './negx.jpg', 
    './posy.jpg', './negy.jpg', 
    './posz.jpg', './negz.jpg'
]);

const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
```

## 3. Comparison of Implementation Methods

| Category | Using IBL (Recommended) | HDRTexture | CubeTexture |
| :--- | :--- | :--- | :--- |
| **Source** | 1 HDR image | 1 HDR image | 6 images |
| **Type** | `CubeTexture` (Converted) | `HDRTexture` | `CubeTexture` |
| **Lighting Data** | Yes (Auto-generated) | No | No |
| **Main Usage** | Background + PBR Lighting | High-quality background | Simple background |

## 4. Live Demo

### A. IBL Method (Including Lighting)

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

### B. CubeMap Method (6 Images)

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

## Key Summary

- **SkyBox** is set on the view (**View3D**) to render the background.
- If realistic lighting is required, it's best to use an environment texture created via **IBL**.
- Use **HDRTexture** or **CubeTexture** if the goal is a simple background.

## Next Steps

- **[IBL](./ibl)**
