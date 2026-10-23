---
title: Mesh LOD
order: 2
---

# Mesh LOD

LOD for `Mesh` calculates the distance from the camera on the CPU each frame and swaps the rendering target to the
matching geometry registered in `mesh.LODManager`.

## 1. How It Works and Usage

Register transition distances and replacement geometries using `mesh.LODManager.addLOD(distance, geometry)`.
`LODManager` selects the geometry of the level with the largest threshold distance less than or equal to the current
camera distance.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create base mesh (distance 0 ~ 10 range)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
    material
);

// 2. Register LOD levels by distance
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8)); // Distance >= 10
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));    // Distance >= 20

scene.addChild(mesh);
```

---

## 2. Live Example

Zoom in and out to observe the geometry transition from a high-detail sphere (32 segments ➔ 8 segments) to a box.

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

    const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 100);
    scene.lightManager.ambientLight = ambientLight;

    // 1. Setup Material and Texture
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = texture;

    // 2. Create Base Mesh (Distance 0 ~ 10)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
        material
    );
    scene.addChild(mesh);

    // 3. Add LOD Levels
    mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));
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
    const renderer = new RedGPU.Renderer();
    const render = () => {
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

---

## Related Examples

- [Mesh CPU LOD](/RedGPU/examples/3d/lod/MeshCPULOD/)
- [Mesh CPU LOD (Per-Level Material)](/RedGPU/examples/3d/lod/MeshCPULOD_material/)
- [Distance Culling](/RedGPU/examples/3d/frustumCulling/distanceCulling/)

---

## Next Steps

- **[Instancing Mesh LOD](./instanced-lod.md)**: Applying GPU-driven LOD to massive instanced meshes
