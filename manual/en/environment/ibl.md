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

    %% Apply custom classes
    class IBL,Skybox mermaid-main;
    class Irradiance,Specular,Environment,PBR mermaid-component;
`
</script>

# IBL

IBL (Image-Based Lighting) is a method of lighting objects using images of the surrounding environment as light sources. It provides realistic reflections and global illumination effects that are difficult to express with simple light sources alone, maximizing the realism of 3D scenes.

## 1. Core Components of IBL

RedGPU's **Image-Based Lighting** (IBL) system analyzes HDR environment maps or cubemap images to automatically create the following three core resources.

<ClientOnly>
  <MermaidResponsive :definition="iblGraph" />
</ClientOnly>

### 1.1 Irradiance Texture
This acts as the basic shading and ambient light for objects, providing natural color even in areas without a direct light source. (**Diffuse Irradiance Map**, accessed via the `irradianceTexture` property)

### 1.2 Specular Prefilter Texture
This is responsible for the effect of the surrounding environment being reflected on an object's surface. It expresses reflections on surfaces like metal or glass in Physically Based Rendering (PBR) materials. (**Specular Prefilter Map**, accessed via the `prefilterTexture` property)

::: tip [Automatic Light Resource Application]
When you assign an `IBL` instance to the `view.ibl` property, the internally generated **Irradiance Texture** and **Specular Prefilter Texture** are automatically applied to all PBR objects rendered in that view.
:::

### 1.3 Environment Texture
This data maintains the original image as a high-resolution cubemap, mainly used as a background texture for **SkyBox**. (Accessed via the `environmentTexture` property)

## 2. Implementation: Creation and Application

To apply IBL, you must create the resource and then register it with the **View3D**.

```javascript
// 1. Create an IBL resource (HDR file recommended)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. Apply IBL to the View (Lighting effect)
view.ibl = ibl;

// 3. Apply a SkyBox to the View (Visual background)
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

## 3. Live Example: Environmental Setup

The example below shows the result of creating both IBL and a SkyBox from an HDR source. Currently, it just looks like a 360-degree background, but this space is already filled with physically accurate light data.

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

## 4. True Value: Synergy with GLTF

Simply looking at the background (SkyBox) may not seem to make a significant difference. However, the true value of this environmental setup is revealed when loading **GLTF models**, which will be covered in the next chapter.

Detailed models created externally mostly use PBR (Physically Based Rendering) materials. IBL provides these models with realistic reflection data and soft environment light, allowing them to achieve photorealistic textures as if they were actually present in that space.

## Next Steps

Based on the objects and environment settings learned so far, let's explore more deeply how to load and control models in actual projects.

- **[GLTF Loader](../assets/model-loading/index.md)**