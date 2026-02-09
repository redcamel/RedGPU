---
title: Instancing Mesh LOD
order: 3
---

# Instancing Mesh LOD

This section covers how to apply LOD to **Instancing Mesh**, which is used for rendering massive amounts of objects.
LOD for `InstancingMesh` calculates the distance for each instance in parallel within the **GPU Shader**. This means there is virtually no CPU overhead, even when applying LOD to tens of thousands of objects.

## 1. How it Works

When LOD is registered to an `InstancingMesh`, **Sub-Draw Calls** equal to the number of LOD levels may be created internally.
However, through rendering pipeline optimization, the GPU determines the camera distance for each instance and references the appropriate geometry buffer for rendering.

## 2. Usage

Use `LODManager.addLOD` just as you would for a regular `Mesh`.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create InstancingMesh (Base: Sphere High Poly)
const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext, 
    10000, 10000, 
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), 
    material
);

// 2. Add LOD Levels
// The GPU calculates the distance for each instance and applies the geometry accordingly.
instancedMesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
instancedMesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

scene.addChild(instancedMesh);
```

## 3. Live Example: 2,000 LOD Objects

Observe how 2,000 objects change their shape depending on their distance from the camera. If you zoom in or out, distant objects appear as **Boxes**, while close objects appear as **Spheres**.

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
    
    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.lightManager.ambientLight = ambientLight;

    // 1. Create InstancingMesh
    // Base detail (distance 0~30): Sphere High (32x32)
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
    // Level 1 (distance 30 or more): Sphere Low (8x8)
    mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
    
    // Level 2 (distance 60 or more): Box
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
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // Full scene rotation
        mesh.rotationY += 0.002;
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

- **GPU Acceleration**: Since the GPU determines distances without CPU calculation, there is almost no performance degradation even with a massive number of objects.
- **Memory Optimization**: Using low-resolution models for distant objects dramatically reduces vertex processing costs.