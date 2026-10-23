---
title: Instancing Mesh LOD
order: 3
---

# Instancing Mesh LOD

LOD for `InstancingMesh` evaluates the camera distance for each instance in parallel within the GPU shader and branches
to the corresponding geometry buffer. This allows distance-based LOD across tens of thousands of instances with
virtually no CPU overhead.

## 1. How It Works and Usage

Use `instancedMesh.LODManager.addLOD(distance, geometry)` just like a standard `Mesh`. Internal sub-draw calls are
organized according to the registered LOD levels, and the GPU classifies and renders each instance with the geometry
matching its distance.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create InstancingMesh (base distance 0 ~ 30 range: Sphere 32x32)
const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    2000, 2000,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), 
    material
);

// 2. Register LOD levels by distance (evaluated per instance on the GPU)
instancedMesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8)); // Distance >= 30
instancedMesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));    // Distance >= 60

scene.addChild(instancedMesh);
```

---

## 2. Live Example

Observe how 2,000 instances individually transition between spheres and boxes based on their distance from the camera.

<ClientOnly>
<CodePen title="RedGPU - Instancing LOD Example" slugHash="lod-instancing">
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
    
    const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 100);
    scene.lightManager.ambientLight = ambientLight;

    // 1. Create InstancingMesh (base distance 0 ~ 30: Sphere 32x32)
    const maxCount = 2000;
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
    
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    const mesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxCount,
        maxCount,
        geometry,
        material
    );
    scene.addChild(mesh);

    // 2. Add LOD Levels
    mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

    // 3. Randomly place instances
    const range = 100;
    for (let i = 0; i < maxCount; i++) {
        const instance = mesh.instanceChildren[i];
        instance.setPosition(
            Math.random() * range * 2 - range,
            Math.random() * range * 2 - range,
            Math.random() * range * 2 - range
        );
        instance.scale = Math.random() * 1.5 + 1.0;
    }

    // 4. Camera Settings
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 150;
    controller.speedDistance = 5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. Render Loop
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 0.002;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[Antialiasing](../antialiasing/index.md)**: Smoothing jagged screen edges
