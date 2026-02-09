---
title: FXAA
order: 3
---

# FXAA (Fast Approximate AA)

**FXAA** is a **post-processing** (Post-Processing) antialiasing technique that analyzes the rendered image to find edges and smooth them.

## 1. Features & Pros

- **Ultra-Fast**: Very low computational cost, making it ideal for mobile devices and low-end hardware.
- **Memory Efficient**: Does not require additional buffers like MSAA.
- **Cons**: The entire screen may appear slightly blurry, which can reduce texture sharpness.

## 2. Usage

Enabled via `antialiasingManager.useFXAA`. Enabling this automatically disables MSAA or TAA.

```javascript
// Enable FXAA (Other AAs are disabled)
redGPUContext.antialiasingManager.useFXAA = true;
```

## 3. Live Example: FXAA Quality Check

Observe how FXAA handles not only geometry edges but also shimmering in textures and highlights.

<ClientOnly>
<CodePen title="RedGPU - FXAA Example" slugHash="antialiasing-fxaa">
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
    light.x = 10; light.y = 10; light.z = 10;
    scene.lightManager.addDirectionalLight(light);
    
    const ambientLight = new RedGPU.Light.AmbientLight();
    ambientLight.intensity = 0.3;
    scene.lightManager.ambientLight = ambientLight;

    // 1. Fine grid floor (To check pattern aliasing)
    const grid = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 50, 50),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#999999')
    );
    grid.drawMode = 'lines';
    scene.addChild(grid);

    // 2. Wireframe Sphere (To check geometry edges)
    const sphere = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 5, 32, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00aaff')
    );
    sphere.y = 5;
    sphere.x = -6;
    sphere.drawMode = 'lines';
    scene.addChild(sphere);

    // 3. Texture Box (To check texture sharpness)
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    boxMaterial.diffuseTexture = texture;
    
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 6, 6, 6),
        boxMaterial
    );
    box.y = 5;
    box.x = 6;
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;
    controller.tilt = -15;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // Initial state: FXAA Enabled
    redGPUContext.antialiasingManager.useFXAA = true;

    // UI: FXAA Toggle
    const btn = document.createElement('button');
    btn.textContent = 'FXAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00CC99', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        if (manager.useFXAA) {
             manager.useFXAA = false;
        } else {
             manager.useFXAA = true;
        }
        
        btn.textContent = `FXAA: ${manager.useFXAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useFXAA ? '#00CC99' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // Slowly rotate to observe texture blurring
        scene.children.forEach(mesh => {
            if(mesh instanceof RedGPU.Display.Mesh) mesh.rotationY += 0.01;
        })
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

- **Post-Processing**: Works on top of the rendered image.
- **Exclusive**: Enabling FXAA disables MSAA and TAA.
- **Global Control**: Controlled via `redGPUContext`.