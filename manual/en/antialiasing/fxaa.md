---
title: FXAA
order: 3
---

# FXAA

**FXAA** (Fast Approximate Antialiasing) is a post-processing antialiasing technique that detects high-contrast edges in
the final rendered 2D image and smooths them.

## 1. Features and Usage

Enable FXAA via `redGPUContext.antialiasingManager.useFXAA`, which automatically disables `TAA` and `MSAA`.

- **Lightweight Execution**: Requires no additional multisampling or history buffers, making it suitable for mobile and
  low-end devices.
- **Limitations**: Because it blends pixels across detected edges in screen space, fine high-frequency texture details
  may appear slightly softened.

```javascript
// Enable global FXAA (other AAs are automatically disabled)
redGPUContext.antialiasingManager.useFXAA = true;
```

---

## 2. Live Example

Observe how FXAA processes geometry outlines and texture edges.

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

    // Initial state: FXAA Enabled
    redGPUContext.antialiasingManager.useFXAA = true;

    // UI: FXAA Toggle
    const btn = document.createElement('button');
    btn.textContent = 'FXAA: ON';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', left: '20px',
        padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
        cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
    });
    btn.onclick = () => {
        const manager = redGPUContext.antialiasingManager;
        manager.useFXAA = !manager.useFXAA;
        
        btn.textContent = `FXAA: ${manager.useFXAA ? 'ON' : 'OFF (None)'}`;
        btn.style.background = manager.useFXAA ? '#00aaff' : '#555';
    };
    document.body.appendChild(btn);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        scene.children.forEach(mesh => {
            if (mesh instanceof RedGPU.Display.Mesh) mesh.rotationY += 0.01;
        });
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Related Examples

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [Sharpen Post-Effect](/RedGPU/examples/postEffect/sharpen/)

---

## Next Steps

- **[Plugin System](../plugins/index.md)**: Using external extension modules
