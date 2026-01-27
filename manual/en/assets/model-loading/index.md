---
title: GLTF Loader
order: 1
---

# GLTF Loader

While you can create basic shapes with **Primitives**, high-quality assets like detailed characters or buildings need to be created in external 3D tools (Blender, Maya, etc.) and imported.
RedGPU provides **GLTFLoader**, which supports loading the web 3D standard format **glTF** (GL Transmission Format) 2.0.

## 1. Loading a Model

You can load `.gltf` or `.glb` files using `RedGPU.GLTFLoader`. Loading is asynchronous, and the result is delivered via a callback function upon completion.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // Model path
    (loader) => {
        // [Load Success] loader.resultMesh is the final model object.
        scene.addChild(loader.resultMesh);
    }
);
```

### Key Properties (GLTFLoader Instance)
- **`resultMesh`**: The `RedGPU.Display.Mesh` object containing the loaded model.
- **`parsingResult`**: Detailed parsing data of the glTF file, including materials, groups, textures, etc.

## 2. Synergy with IBL (Highly Recommended)

Most high-quality models imported from external sources use **PBR (Physically Based Rendering)** materials. Since these materials express textures by reflecting light information from the surrounding environment, you can achieve the most realistic results when using them with **IBL** (Image-Based Lighting) learned earlier.

If you load a PBR model without IBL, metallic textures may appear black or look very awkward.

## 3. Practical Example: Environment Light and Model Loading

This is the full process of setting up an environment with IBL and loading a detailed metal helmet model. You can adjust the `distance` property of the camera controller to observe the model at an appropriate size.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    // 1. Set Camera Distance (Adjust to fit model size)
    controller.distance = 3; 

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 2. Setup IBL and SkyBox (Key for PBR materials)
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 3. Load GLTF Model
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

Check out the metal helmet model reflecting the IBL environment light realistically.

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

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3; // Adjust camera distance

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // Setup IBL and Skybox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
            
            const renderer = new RedGPU.Renderer();
            renderer.start(redGPUContext, () => {
                loader.resultMesh.rotationY += 1;
            });
        }
    );
});
</pre>
</CodePen>
</ClientOnly>

## Next Steps

Learn about image-based objects that will enrich the 3D space along with text.

- **[Sprite & SpriteSheet](../sprite/index.md)**
