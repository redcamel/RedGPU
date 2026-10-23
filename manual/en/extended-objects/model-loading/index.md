---
title: GLTF Loader
order: 1
---

<script setup>
const loaderGraph = `
    GLTF[".gltf / .glb File"] -->|Async Load & Parse| Loader["GLTFLoader (Loader)"]
    Loader -->|Create PBRMaterial| Mat["Material (Surface)"]
    Loader -->|Parse Geometry| Geo["Geometry (Skeleton)"]
    Mat --> Mesh["resultMesh (Final Mesh)"]
    Geo --> Mesh

    %% Grayscale styles applied
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# GLTF Loader

While you can create basic shapes with **Primitives**, high-quality assets such as detailed characters or buildings need
to be created in external 3D tools (Blender, Maya, etc.) and then imported.
RedGPU provides the `GLTFLoader`, which supports loading the web 3D standard format **glTF** (GL Transmission Format)
2.0.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

## 1. Loading a Model

Creating a `GLTFLoader` instance asynchronously loads and parses the file. Once complete, add `loader.resultMesh` passed
to the callback function to the `Scene`.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // Model path
    (loader) => {
        // Add the loaded root mesh (resultMesh) to the scene
        scene.addChild(loader.resultMesh);
    }
);
```

- **`resultMesh`**: The root `Mesh` object containing the loaded model hierarchy.
- **`parsingResult`**: Detailed parsed data including `materials`, `textures`, and `animations`.

> [!TIP]
> Since most glTF models use `PBRMaterial`, we recommend configuring `IBL` environment lighting on `view.ibl` for
realistic metallic reflections and shading.

## 2. Practical Example: Environment Light and Model Loading

An example of setting up an environment with `IBL` and loading a metallic helmet model.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 1. Configure IBL and SkyBox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 2. Load GLTF Model
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - GLTF Loader with IBL" slugHash="gltf-loader">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    let targetMesh;
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            targetMesh = loader.resultMesh;
            scene.addChild(targetMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        if (targetMesh) targetMesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Related Examples

- [DamagedHelmet Model Loading](/RedGPU/examples/gltf/models/helmets/)
- [glTF Basic Animations](/RedGPU/examples/gltf/animation/basicAnimations/)
- [Animation Motion Blending](/RedGPU/examples/gltf/animation/motionBlending/)
- [Sponza Scene Model](/RedGPU/examples/gltf/models/sponza/)

---

## Next Steps

Learn how to render thousands of identical objects with high performance in a single draw call.

- **[Instancing Mesh](../instanced-mesh/index.md)**
