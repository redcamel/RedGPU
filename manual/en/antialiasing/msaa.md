---
title: MSAA
order: 2
---

# MSAA

**MSAA** (Multisample Antialiasing) is a GPU hardware-based antialiasing technique that samples geometry boundaries
(edges) multiple times to eliminate jagged outlines. It is enabled by default on standard displays
(`devicePixelRatio <= 1.0`).

## 1. Features and Usage

Enable MSAA via `redGPUContext.antialiasingManager.useMSAA`, which automatically disables `TAA` and `FXAA`.

- **Edge-Specialized**: Produces crisp and clean polygon outlines.
- **Limitations**: Multi-sampling the entire G-Buffer consumes significant memory bandwidth, and it does not resolve
  interior texture shimmering or shader aliasing.

```javascript
// Enable global MSAA (other AAs are automatically disabled)
redGPUContext.antialiasingManager.useMSAA = true;
```

---

## 2. Live Example

Toggle MSAA on and off to compare changes along geometry outlines.

<ClientOnly>
<CodePen title="RedGPU - MSAA Example" slugHash="antialiasing-msaa">
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
    
    const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 60);
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

    // Initial state: MSAA Enabled
    redGPUContext.antialiasingManager.useMSAA = true;

    // UI: MSAA Toggle
    const btn = document.createElement('button');
    btn.textContent = 'MSAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        manager.useMSAA = !manager.useMSAA;
        
        btn.textContent = `MSAA: ${manager.useMSAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useMSAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sphere.rotationY += 0.01;
        box.rotationY += 0.01;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[FXAA](./fxaa.md)**: Fast approximate post-processing antialiasing
- **[TAA](./taa.md)**: Temporal accumulation antialiasing
