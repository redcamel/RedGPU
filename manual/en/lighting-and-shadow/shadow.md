---
title: Shadow System
order: 3
---

<script setup>
const shadowGraph = `
    Light["Light (DirectionalLight)"] -->|Shine| Caster["Caster (castShadow = true)"]
    Caster -->|Project| Receiver["Receiver (receiveShadow = true)"]

    %% Grayscale styles applied
    style Light fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Caster fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Receiver fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Shadow System

RedGPU provides up to 4-stage **Cascaded Shadow Maps** (CSM), **sub-pixel texel snapping** to eliminate shadow edge
shimmering during camera movement, and a **16-Tap Vogel Spiral PCSS** soft shadow pipeline.

<ClientOnly>
  <MermaidResponsive :definition="shadowGraph" />
</ClientOnly>

---

## 1. Three Elements of Shadow Generation

Shadow rendering requires configuring the light source, shadow caster (`castShadow`), and shadow receiver
(`receiveShadow`).

1. **Light**: `DirectionalLight` supports shadow generation.
2. **Caster**: Object that casts shadows (`mesh.castShadow = true`)
3. **Receiver**: Surface object that receives shadows (`mesh.receiveShadow = true`)

```javascript
box.castShadow = true;     // Shadow caster
floor.receiveShadow = true; // Shadow receiver
```

> [!WARNING]
> Shadow depth passes incur additional draw calls. Enable `castShadow` selectively on visually important objects for
optimal performance.

---

## 2. Shadow Quality Control

Globally control CSM cascades and PCSS soft shadow parameters via `scene.shadowManager.directionalShadowManager`.

| Property                     | Default   | Description                                                                     |
|:-----------------------------|:----------|:--------------------------------------------------------------------------------|
| **`shadowDepthTextureSize`** | `2048`    | Resolution of each cascade shadow map (`256 ~ 8192`)                            |
| **`cascadeCount`**           | `4`       | Number of CSM cascade splits (`1 ~ 4`)                                          |
| **`maxShadowDistance`**      | `200`     | Maximum world distance from the camera where shadows are rendered               |
| **`targetNearTexelSize`**    | `0.02`    | Target world texel size maintained by the first near cascade (Cascade 0)        |
| **`pcssLightSize`**          | `1.0`     | Virtual light size for PCSS soft shadows (higher values produce wider penumbra) |
| **`strength`**               | `0.9`     | Shadow opacity strength (`0.0 ~ 1.0`)                                           |
| **`bias`**                   | `0.00015` | Depth bias offset to prevent surface shadow acne                                |

```javascript
const dirShadowManager = scene.shadowManager.directionalShadowManager;
dirShadowManager.shadowDepthTextureSize = 2048;
dirShadowManager.cascadeCount = 4;
dirShadowManager.maxShadowDistance = 200;
dirShadowManager.pcssLightSize = 1.0;
dirShadowManager.strength = 0.9;
```

---

## 3. Shadow Scene Example

Below is an example projecting the shadow of a rotating box (`castShadow = true`) onto a floor (`receiveShadow = true`)
under a `DirectionalLight`.

```javascript
// 1. Register directional light
const light = new RedGPU.Light.DirectionalLight();
light.x = -3;
light.y = 5;
light.z = 3;
scene.lightManager.addDirectionalLight(light);

// 2. Create floor (Shadow Receiver)
const floor = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
);
floor.receiveShadow = true;
scene.addChild(floor);

// 3. Create box (Shadow Caster)
const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
);
box.y = 3;
box.castShadow = true;
scene.addChild(box);
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Shadow" slugHash="shadow-basic">
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
    light.x = -3; light.y = 5; light.z = 3;
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 50);

    // Floor (Receiver)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
    );
    floor.receiveShadow = true;
    scene.addChild(floor);

    // Box (Caster)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
    );
    box.y = 3;
    box.castShadow = true;
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationZ += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[PBR Material](./pbr-material.md)**: Configuring Metallic-Roughness Physically Based Rendering (PBR) materials
