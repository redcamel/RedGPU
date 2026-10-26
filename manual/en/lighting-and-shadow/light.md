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

While **Texture** is like applying an illustration to an object's surface, **Light** is the 'vitality' that gives that
object three-dimensionality and depth.

## 1. Physical Light Units

Since RedGPU supports physically-based rendering (PBR), light intensity is controlled using real-world physical light
units.

| Unit           | Property | Target Lights                      | Description                                                                                         |
|:---------------|:---------|:-----------------------------------|:----------------------------------------------------------------------------------------------------|
| **Lux (lx)**   | `lux`    | `DirectionalLight`, `AmbientLight` | Illuminance reaching a surface area. Midday sunlight on a clear day is approximately `100,000` Lux. |
| **Lumen (lm)** | `lumen`  | `PointLight`, `SpotLight`          | Total luminous flux emitted from a light source. Commonly used to measure bulb brightness.          |

---

## 2. LightManager

Creating a light alone does not affect the screen. It must be registered in the `lightManager` of the `Scene` for the
engine to include it in its calculations.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

::: tip [Default Lighting State]
For materials that require a light source (such as PhongMaterial, PBRMaterial, etc.), nothing will be visible on the
screen if no lights are configured.
:::

::: info [Light Registration Limits]
To optimize shader and buffer calculations, RedGPU restricts the maximum number of lights that can be registered.
Attempting to exceed these limits will throw an error:

- **`DirectionalLight`**: Maximum of **3**
- **PointLight + SpotLight (Cluster Lights)**: Combined maximum of **1,024**
- **`AmbientLight`**: Maximum of **1** per Scene (assigned directly to the property)
  :::

```javascript
// Add directional light (Multiple allowed)
scene.lightManager.addDirectionalLight(directionalLight);

// Add point light (Multiple allowed)
scene.lightManager.addPointLight(pointLight);
```

## 3. Main Types of Lighting

RedGPU provides four types of light sources with different physical characteristics. It is important to understand the
characteristics of each light and combine them appropriately.

### 3.1 `DirectionalLight`

Light that shines in parallel from an infinitely distant source in a specific direction, like the sun.

- **Features & Usage**: Direction (`direction`) is constant regardless of position, primarily used for global lighting
  and shadow generation.
- **Unit**: **Lux** (`lux`, default `100,000`)

### 3.2 `PointLight`

Light that radiates in all directions from a single point in space, like a light bulb.

- **Features & Usage**: Distance-based **attenuation** occurs, and the `radius` property controls the reach to emphasize
  specific areas.
- **Unit**: **Lumen** (`lumen`, default `1,000`)

### 3.3 `SpotLight`

A light source that shines a cone-shaped beam in a specific direction from a single point, like a flashlight or stage
light.

- **Features & Usage**: Creates concentrated lighting effects by adjusting the inner angle (`innerCutoff`), outer angle
  (`outerCutoff`), and reach (`radius`).
- **Unit**: **Lumen** (`lumen`, default `1,000`)

### 3.4 `AmbientLight`

Fill light that shines uniformly from all directions onto objects.

- **Features & Usage**: Has no position or direction and casts no shadows. Used to soften dark areas where direct light
  does not reach and to adjust overall base brightness.
- **Unit**: **Lux** (`lux`, default `50`)

::: warning [Material Note]
**`ColorMaterial`** is not affected by light and outputs only a single color. To see lighting effects, you must use a
glossy or textured material such as **`PhongMaterial`** or **`PBRMaterial`**.
:::

## 4. Practice: Diverse Lighting Configuration

Place a floor and multiple spheres, and implement an effect where light spreads in space by moving two **PointLights**
of different colors.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Blue PointLight
    const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    // 2. Red PointLight
    const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    // 3. Create floor and objects (Use PhongMaterial)
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    // Floor
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        material
    );
    scene.addChild(floor);

    // Place 25 spheres
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
    
    // 4. Lighting animation
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
```

### Live Demo

Observe the changes in light on the surface of objects as the position of the light source moves.

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

    const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
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


## Related Examples

- [DirectionalLight](/RedGPU/examples/3d/light/directionalLight/)
- [PointLight](/RedGPU/examples/3d/light/pointLight/)
- [Multi-PointLight Performance](/RedGPU/examples/3d/light/pointLightPerformance/)
- [SpotLight](/RedGPU/examples/3d/light/spotLight/)
