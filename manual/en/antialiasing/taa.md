---
title: TAA
order: 1
---

# TAA

**TAA** (Temporal Antialiasing) is a temporal accumulation technique that jitters the camera at sub-pixel intervals each
frame and blends previous frame history with the current frame to eliminate jagged edges. It suppresses aliasing not
only on geometry outlines but also across textures and shader highlights.

## 1. Features and Usage

Enable TAA globally via `redGPUContext.antialiasingManager.useTAA`, which automatically disables `MSAA` and `FXAA`. Any
slight softening from temporal accumulation is restored through the built-in Contrast Adaptive Sharpening pass
(`TAACASPass`), controlled per `View3D` via `view.taa`.

- **`view.taa.sharpness`** (`number`, default: `0.5`, range: `0.0 ~ 1.0`): Adjusts contrast adaptive sharpening
  intensity per view.
- **`view.taa.reset()`**: Immediately clears the temporal history buffer upon camera teleportation or scene cuts to
  prevent ghosting trails.

```javascript
// 1. Enable global TAA (other AAs are automatically disabled)
redGPUContext.antialiasingManager.useTAA = true;

// 2. Adjust per-view sharpening intensity (0.0 ~ 1.0, default: 0.5)
view.taa.sharpness = 0.5;

// 3. Reset temporal history buffer when teleporting the camera
view.taa.reset();
```

---

## 2. Live Example

Compare how TAA resolves aliasing on fine grid patterns, wireframe edges, and textured surfaces.

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
        manager.useTAA = !manager.useTAA;
        
        btn.textContent = `TAA: ${manager.useTAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useTAA ? '#00aaff' : '#555';
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

## Related Examples

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [Sponza Scene](/RedGPU/examples/gltf/models/sponza/)

---

## Next Steps

- **[MSAA](./msaa.md)**: Hardware multisample antialiasing
- **[FXAA](./fxaa.md)**: Fast approximate post-processing antialiasing
