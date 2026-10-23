---
title: Light
order: 1
---
<script setup>
const lightGraph = `
    graph TD
        Scene["Scene (Stage)"]
        LightMgr["LightManager (Director)"]
        Ambient["AmbientLight (All Directions)"]
        DirLight["DirectionalLight (Sun)"]
        PointLight["PointLight (Bulb)"]
        SpotLight["SpotLight (Flashlight)"]

        Scene -->|Has| LightMgr
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        LightMgr -->|Manages| PointLight
        LightMgr -->|Manages| SpotLight
        
        %% Grayscale styles applied
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style PointLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style SpotLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Light

RedGPU's lighting system operates on physical light units (`Lux`, `Lumen`) and centrally manages all light sources
through `LightManager` inside `Scene`.

---

## 1. Physical Light Units

| Unit        | Physical Meaning                | Target Lights                      | Description                                                                                  |
|:------------|:--------------------------------|:-----------------------------------|:---------------------------------------------------------------------------------------------|
| **`Lux`**   | Illuminance ($1\text{ lm/m}^2$) | `DirectionalLight`, `AmbientLight` | Brightness of light reaching a unit area (controlled via `lux`)                              |
| **`Lumen`** | Luminous Flux ($\text{lm}$)     | `PointLight`, `SpotLight`          | Total amount of light emitted in all directions from a point source (controlled via `lumen`) |

---

## 2. LightManager and Registration

Created lights must be registered with `scene.lightManager` to be included in rendering calculations.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

```javascript
// Register directional and point lights
scene.lightManager.addDirectionalLight(directionalLight);
scene.lightManager.addPointLight(pointLight);

// Assign ambient light (1 per Scene)
scene.lightManager.ambientLight = ambientLight;
```

> [!IMPORTANT]
> **Light Registration Limits & Material Requirements**
> - **`DirectionalLight`**: Up to **3**
> - **`PointLight` + `SpotLight`** (Cluster Lights): Up to **1,024** combined
> - **`AmbientLight`**: Up to **1** per `Scene`
> - `ColorMaterial` is an unlit material unaffected by lights; use `PhongMaterial` or `PBRMaterial` to render lighting
    effects.

---

## 3. Light Types and Key Properties

| Light Class            | Unit (Default)    | Key Properties                                               | Characteristics & Usage                                                                                             |
|:-----------------------|:------------------|:-------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| **`DirectionalLight`** | `lux` (`100,000`) | `direction`, `color`, `lux`                                  | Parallel light (sunlight) shining in a constant direction regardless of position; supports shadow (CSM) generation. |
| **`PointLight`**       | `lumen` (`1,000`) | `x/y/z`, `radius`, `color`, `lumen`                          | Radiates in all directions from a point and attenuates with distance within `radius`.                               |
| **`SpotLight`**        | `lumen` (`1,000`) | `x/y/z`, `direction`, `radius`, `innerCutoff`, `outerCutoff` | Projects a cone-shaped beam of light in a specific direction.                                                       |
| **`AmbientLight`**     | `lux` (`50`)      | `color`, `lux`                                               | Uniformly brightens dark areas across the scene without direction or shadows.                                       |

---

## 4. Multi-PointLight Example

Below is an example placing a floor and spheres with `PhongMaterial` and animating two colored `PointLight` instances.

```javascript
const blueLight = new RedGPU.Light.PointLight('#0000ff', 1000);
blueLight.radius = 15;
scene.lightManager.addPointLight(blueLight);

const redLight = new RedGPU.Light.PointLight('#ff0000', 1000);
redLight.radius = 15;
scene.lightManager.addPointLight(redLight);

// Animate light positions inside the frame loop
renderer.start(redGPUContext, (time) => {
    const t = time / 1000;
    blueLight.x = Math.sin(t) * 10;
    blueLight.z = Math.cos(t) * 10;
    redLight.x = Math.sin(t + 3.14) * 10;
    redLight.z = Math.cos(t + 3.14) * 10;
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Multi Lights" slugHash="multi-lights-demo">
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
    
    const blueLight = new RedGPU.Light.PointLight('#0000ff', 1000);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    const redLight = new RedGPU.Light.PointLight('#ff0000', 1000);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff');
    
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        material
    );
    scene.addChild(floor);

    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
    for (let i = 0; i < 25; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i % 5 - 2) * 4;
        mesh.z = (Math.floor(i / 5) - 2) * 4;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const t = time / 1000;
        blueLight.x = Math.sin(t) * 10;
        blueLight.z = Math.cos(t) * 10;
        blueLight.y = Math.sin(t * 0.5) * 5 + 5;

        redLight.x = Math.sin(t + 3.14) * 10;
        redLight.z = Math.cos(t + 3.14) * 10;
        redLight.y = Math.cos(t * 0.5) * 5 + 5;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[Phong Material](./phong-material.md)**: Configuring surface shading and multi-texture maps that react to light
