---
title: Phong Material
order: 2
---

<script setup>
const phongGraph = `
    Ambient["Ambient Light"] --> Phong["Phong Reflection"]
    Diffuse["Diffuse Reflection"] --> Phong
    Specular["Specular Reflection"] --> Phong

    %% Grayscale styles applied
    style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Diffuse fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Specular fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Phong fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Phong Material

**Phong Material** is a material that implements the **Phong Reflection Model**, one of the most widely used lighting
models in 3D graphics. Beyond simply painting colors, you can realistically adjust the texture of an object using
various **Texture Maps**.

<ClientOnly>
  <MermaidResponsive :definition="phongGraph" />
</ClientOnly>

## 1. Implementing Texture via Texture Maps

`PhongMaterial` completes the detail of an object by overlaying multiple texture layers. RedGPU supports various maps as
follows:

| Texture Map             | Role                                | Effect                                                                                      |
|:------------------------|:------------------------------------|:--------------------------------------------------------------------------------------------|
| **diffuseTexture**      | Basic pattern (Color Map)           | Determines the basic color and pattern of the object surface                                |
| **normalTexture**       | Surface irregularities (Normal Map) | Expresses fine unevenness and three-dimensionality without having to subdivide actual faces |
| **specularTexture**     | Gloss map (Specular Map)            | Defines which parts of the object will be shinier (metal, plastic, etc.)                    |
| **emissiveTexture**     | Light-emitting map (Emissive Map)   | Specifies areas that emit light themselves, regardless of lighting                          |
| **alphaTexture**        | Transparency map (Alpha Map)        | Specifies transparent or opaque areas based on texture brightness                           |
| **displacementTexture** | Displacement map                    | Moves actual geometry vertices to create physical unevenness                                |

## 2. Key Property Control

You can control the intensity and sharpness of highlights through numerical adjustments.

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

// 1. Basic color and transparency
material.color.setColorByHEX('#00CC99');
material.alpha = 1.0;

// 2. Highlight (Specular) control
material.shininess = 32;    // Sharpness of the highlight (Shininess)
material.specularStrength = 1.0; // Intensity of the highlight
```

## 3. Practical Example: Combining Textures

By applying multiple maps simultaneously, you can make a simple sphere look like a detailed planet or a complex
mechanical part.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Lighting Setup (PhongMaterial requires light to be visible)
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    // 2. Create a material
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    // 3. Apply various texture maps
    const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';
    
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
    material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
    material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext, () => {
        mesh.rotationY += 1;
    });
});
```

### Live Demo

Observe how `PhongMaterial` with applied texture maps reacts under lighting.

<ClientOnly>
<CodePen title="RedGPU Basics - Phong Material Texture" slugHash="phong-material-texture">
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
    
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 50);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
    material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
    material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
    material.shininess = 32;

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

- **Phong Material** is a lighting material that calculates light **Diffuse** and **Specular** reflections.
- Using a **Normal Map** allows for expressing detailed surface textures without having to subdivide faces.
- Physical three-dimensionality can be created by transforming actual geometry through a **Displacement Map**.

---

## Related Examples

- [PhongMaterial Basics](/RedGPU/examples/3d/material/phongMaterial/)
- [PhongMaterial Multi-Texture Maps](/RedGPU/examples/3d/material/phongMaterialTextures/)
- [UV Transform](/RedGPU/examples/3d/material/uvTransform/)
- [Opacity Control](/RedGPU/examples/3d/material/opacity/)

---

## Next Steps

Learn about `PBRMaterial`, which realistically expresses metallic and roughness properties through Physically Based
Rendering (PBR).

- **[PBR Material](./pbr-material.md)**