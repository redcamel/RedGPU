---
title: TAA
order: 1
---

# TAA (Temporal AA)

**TAA** (Temporal Antialiasing) is a time-based technique that blends information from previous frames with the current frame to eliminate jagged edges. It provides the highest quality among current antialiasing techniques, producing smooth, cinematic images.

## 1. How it Works

TAA works by slightly jittering the camera every frame and then accumulating and averaging multiple rendered frames. This process allows the engine to obtain resolution information more precise than a single pixel.

- **Pros**: Provides near-perfect antialiasing quality in static or slow-moving scenes.
- **Cons**: Ghosting artifacts (trails) may occur on fast-moving objects.

## 2. Usage

Enabled via `antialiasingManager.useTAA`. Enabling this automatically disables MSAA or FXAA.

```javascript
// Enable TAA (Other AAs are disabled)
redGPUContext.antialiasingManager.useTAA = true;
```

## 3. Live Example: TAA Quality Check

Observe how TAA handles edges, textures, and fine patterns in the same scene. (Notice how it perfectly resolves the shimmering in the grid pattern and texture details.)

<ClientOnly>
<CodePen title="RedGPU - TAA Example" slugHash="antialiasing-taa">
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

    // Initial state: TAA Enabled
    redGPUContext.antialiasingManager.useTAA = true;

    // UI: TAA Toggle Button
    const btn = document.createElement('button');
    btn.textContent = 'TAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        if (manager.useTAA) {
            manager.useTAA = false; // Turn off
        } else {
            manager.useTAA = true;  // Turn on
        }
        
        btn.textContent = `TAA: ${manager.useTAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useTAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        sphere.rotationY += 0.01;
        box.rotationY += 0.01;
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

- **Best Quality**: Almost completely eliminates jagged edges.
- **Auto-Selection**: Automatically enabled on high-DPI displays (like Retina).
- **High Cost**: Recommended for desktop environments due to per-frame computation and memory overhead.