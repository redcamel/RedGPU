---
order: 2
---

<script setup>
const iblGraph = `
    HDR["HDR Source"] -->|new| IBL["RedGPU.Resource.IBL"]
    Cube["6 Images (CubeMap)"] -->|new| IBL
    
    subgraph Outputs ["Generated Resources"]
        IBL --> Irradiance["irradianceTexture (Diffuse)"]
        IBL --> Specular["prefilterTexture (Specular)"]
        IBL --> Environment["environmentTexture (Background)"]
    end

    Irradiance -->|Lighting| PBR["PBR Material"]
    Specular -->|Reflection| PBR
    Environment -->|Background| Skybox["RedGPU.Display.SkyBox"]

    %% Grayscale styles applied
    style HDR fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Cube fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Irradiance fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Specular fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Environment fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
    style Skybox fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# IBL

**Image-Based Lighting** (IBL, `RedGPU.Resource.IBL`) is a resource that analyzes surrounding environment images as
light sources to provide realistic reflections and global diffuse illumination to Physically Based Rendering (PBR)
materials.

## 1. Core Components

`IBL` takes an HDR environment map or cubemap images and automatically generates three cube texture resources.

<ClientOnly>
  <MermaidResponsive :definition="iblGraph" />
</ClientOnly>

| Property                 | Role                  | Description                                                                                                           |
|:-------------------------|:----------------------|:----------------------------------------------------------------------------------------------------------------------|
| **`irradianceTexture`**  | Diffuse Ambient Light | Provides basic shading and ambient illumination, giving natural color even in areas without direct light sources.     |
| **`prefilterTexture`**   | Specular Reflection   | A reflection map pre-filtered by roughness level, expressing environmental reflections on metallic or glass surfaces. |
| **`environmentTexture`** | Visual Background     | A high-resolution cubemap converted from the source image, primarily used as the background texture for `SkyBox`.     |

> [!TIP]
> Assigning an `IBL` instance to `view.ibl` automatically applies its `irradianceTexture` and `prefilterTexture` to all
PBR objects (such as glTF models) rendered in that view.

---

## 2. Creation and Application

Create an `IBL` resource and assign it to the `ibl` and `skybox` properties of a `View3D`.

```javascript
// 1. Create an IBL resource (HDR file recommended)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. Apply IBL lighting to the View
view.ibl = ibl;

// 3. Apply a SkyBox background to the View
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

---

## 3. Live Example

The example below configures both `IBL` and `SkyBox` from an HDR source. When loading PBR assets such as external glTF
models, this environment data drives photorealistic metallic reflections and ambient lighting.

<ClientOnly>
<CodePen title="RedGPU Basics - Environmental Setup" slugHash="env-setup">
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

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // Set up IBL and a SkyBox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
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

- **[SkyAtmosphere](./skyatmosphere.md)**: Creating dynamic sky effects via real-time physically based atmospheric
  scattering simulation
