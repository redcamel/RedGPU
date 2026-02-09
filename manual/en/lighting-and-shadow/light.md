---
title: Light
order: 2
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
        
        %% Apply custom classes
        class Scene mermaid-main;
        class LightMgr mermaid-system;
`
</script>

# Light

While **Texture** is like applying an illustration to an object's surface, **Light** is the 'vitality' that gives that object three-dimensionality and depth.
All lights in RedGPU are managed centrally through the **LightManager**, allowing for dramatic direction by combining various light sources.

## 1. LightManager

Creating a light alone does not affect the screen. It must be registered in the `lightManager` of the **Scene** for the engine to include it in its calculations.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

::: tip [Default Lighting State]
If no light is set, the scene will be in total darkness. However, adding **AmbientLight** at a very low intensity allows you to at least see the outline of shadow areas where direct light does not reach.
:::

```javascript
// Add directional light (Multiple allowed)
scene.lightManager.addDirectionalLight(directionalLight);

// Add point light (Multiple allowed)
scene.lightManager.addPointLight(pointLight);
```

## 2. Main Types of Lighting

RedGPU provides four types of light sources with different physical characteristics. It is important to understand the characteristics of each light and combine them appropriately.

| Type | Features | Main Usage | Analogy |
| :--- | :--- | :--- | :--- |
| **AmbientLight** | Shines uniformly from all directions | Softening shadows, overall brightness correction | Fill light |
| **DirectionalLight** | Parallel light (Sunlight) | Global lighting, shadow generation | The Sun |
| **PointLight** | Spreads from a single point | Emphasizing specific areas, distance-based attenuation | Light bulb |
| **SpotLight** | Concentrated cone-shaped light | Highlight lighting, theatrical stage effects | Flashlight |

### 2.1 AmbientLight
Light that shines uniformly from all directions onto objects.
- **Features**: Has no position or direction, and creates no shadows. It is used for correction to slightly brighten dark areas where light does not reach.

### 2.2 DirectionalLight
Light that shines in parallel from an infinitely distant source in a specific direction, like the sun.
- **Features**: Direction is constant regardless of position, and it is the most representative light source capable of creating shadows.

### 2.3 PointLight
Light that radiates in all directions from a point in space.
- **Features**: **Attenuation** occurs, where brightness decreases in proportion to the square of the distance. The `radius` property determines the range the light reaches.

### 2.4 SpotLight
A light source that shines a cone-shaped light in a specific direction from a specific point.
- **Features**: Creates concentrated lighting effects by adjusting the light's `angle` and outer softness (`exponent`).

::: warning [Material Note]
**ColorMaterial** is not affected by light and outputs only a single color. To see lighting effects, you must use a glossy or textured material such as **PhongMaterial** or **PBRMaterial**.
:::

## 3. Practice: Diverse Lighting Configuration

Place a floor and multiple spheres, and implement an effect where light spreads in space by moving two **PointLights** of different colors.

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

## Key Summary

- Manage all light sources by registering and controlling them via the **LightManager**.
- To see lighting effects, you must use glossy materials such as **PhongMaterial** or **PBRMaterial**.
- **DirectionalLight** is suitable for global lighting, while **PointLight** and **SpotLight** are better for highlight lighting.

## Next Learning Recommendation

Where there is light, there is shadow. Learn about the shadow system that completes a realistic sense of space.

- **[Shadow](./shadow.md)**