---
title: Mesh LOD
order: 2
---

# Mesh LOD

This section covers how to apply LOD to general **Mesh** objects.
LOD for a `Mesh` works by calculating the distance from the camera on the CPU every frame and swapping to the **Geometry** that meets the condition.

## 1. How it Works

The `LODManager` inside the `Mesh` iterates through the registered LOD levels and finds the level with the largest distance value that is less than or equal to the current camera distance.
When a suitable level is found, the rendering target is swapped to the geometry registered in that level.

## 2. Usage

Use `mesh.LODManager.addLOD(distance, geometry)` to register geometry by distance.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create Base Mesh (Distance 0~10)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32), 
    material
);

// 2. Add LOD Levels
// Distance 10 or more: Sphere (16x16)
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 1, 16, 16));

// Distance 20 or more: Box
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext));

scene.addChild(mesh);
```

## 3. Live Example

Observe how the sphere shape becomes simpler and eventually turns into a box as the distance increases.

<ClientOnly>
<CodePen title="RedGPU - Mesh LOD Example" slugHash="lod-mesh-basic">
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
    
    // Add Lights
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.lightManager.ambientLight = ambientLight;

    // 1. Setup Material and Texture
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    // 2. Create Base Mesh (Distance 0 ~ 10)
    // High Detail: Sphere (radius 2, segments 32x32)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
        material
    );
    scene.addChild(mesh);

    // 3. Add LOD Levels
    // Level 1: Distance 10 or more (Mid Detail - Sphere 2, 8x8)
    mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    
    // Level 2: Distance 20 or more (Low Detail - Box 3x3x3)
    mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

    // 4. Status Display UI
    const label = document.createElement('div');
    Object.assign(label.style, {
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '16px', textAlign: 'center'
    });
    document.body.appendChild(label);

    // 5. Camera Settings
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 10;
    controller.speedDistance = 0.5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 6. Render Loop
    const renderer = new RedGPU.Renderer(redGPUContext);
    const render = () => {
        // Calculate distance and update UI (for visual confirmation)
        const dist = Math.sqrt(
            Math.pow(view.rawCamera.x - mesh.x, 2) +
            Math.pow(view.rawCamera.y - mesh.y, 2) +
            Math.pow(view.rawCamera.z - mesh.z, 2)
        );
        
        let currentLevel = "High (Sphere 32)";
        if (dist >= 20) currentLevel = "Low (Box)";
        else if (dist >= 10) currentLevel = "Mid (Sphere 8)";

        label.innerHTML = `Distance: ${dist.toFixed(1)}m <br/> Geometry: ${currentLevel}`;
    };
    
    renderer.start(redGPUContext, render);
});
</pre>
</CodePen>
</ClientOnly>
