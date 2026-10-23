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

`PhongMaterial` is a lighting material based on the Phong reflection model (combining Ambient, Diffuse, and Specular
components) and supports multi-texture maps for surface relief and glossiness.

<ClientOnly>
  <MermaidResponsive :definition="phongGraph" />
</ClientOnly>

---

## 1. Key Properties and Texture Maps

| Property                  | Type                  | Description                                                                           |
|:--------------------------|:----------------------|:--------------------------------------------------------------------------------------|
| **`color` / `alpha`**     | `ColorRGB` / `number` | Base surface color and opacity (`0.0 ~ 1.0`)                                          |
| **`shininess`**           | `number`              | Sharpness of the specular highlight (default: `32`)                                   |
| **`specularStrength`**    | `number`              | Specular highlight intensity multiplier (default: `1.0`)                              |
| **`diffuseTexture`**      | `BitmapTexture`       | Base color and pattern map                                                            |
| **`normalTexture`**       | `BitmapTexture`       | Normal map expressing fine surface relief without subdividing geometry                |
| **`specularTexture`**     | `BitmapTexture`       | Specular map defining per-area reflectance differences                                |
| **`emissiveTexture`**     | `BitmapTexture`       | Self-illuminating emissive map independent of lighting                                |
| **`alphaTexture`**        | `BitmapTexture`       | Alpha mask map controlling transparency based on luminance                            |
| **`displacementTexture`** | `BitmapTexture`       | Vertex displacement map creating physical protrusion (scaled via `displacementScale`) |
| **`useSSR`**              | `boolean`             | Enables Screen Space Reflection on the material                                       |

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.color.setColorByHEX('#00CC99');
material.shininess = 32;
material.specularStrength = 1.0;
material.displacementScale = 0.5;
```

---

## 2. Multi-Texture Combination Example

Below is an example combining diffuse, normal, specular, and `displacementTexture` maps on a sphere.

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
material.displacementScale = 0.5;
material.shininess = 32;
```

### Live Demo

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
    material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
    
    material.displacementScale = 0.5;
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

---

## Next Steps

- **[Shadow System](./shadow.md)**: Configuring Cascaded Shadow Maps (CSM) and soft shadows
