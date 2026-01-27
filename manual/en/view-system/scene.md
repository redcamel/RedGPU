---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager (Uniform Buffer)"]
        Children["Child Nodes (Mesh, Group)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
`
</script>

# Scene

If **View3D** is the 'window' that shows the scene, **Scene** is the 'stage' that unfolds beyond that window.
It acts as the highest root node of the **Scene Graph** containing all 3D objects (Mesh, Group) and lights (Light) to be rendered.

## 1. Architecture and Role

**Scene** goes beyond being a simple container and performs the following core functions:

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

*   **Hierarchy Management**: Manages parent-child relationships of objects through `addChild()` and `removeChild()` methods.
*   **Lighting Data Management**: Integratedly manages lighting data that affects the entire scene through the essentially included **LightManager** as GPU buffers (Uniform Buffer).

## 2. Object Management (Hierarchy)

The most basic role of a **Scene** is to hold the 3D objects to be rendered. Created objects must be added to the scene through `addChild()` to appear on the screen.

```javascript
// 1. Create Scene
const scene = new RedGPU.Display.Scene();

// 2. Create and add 3D object (Mesh)
// Don't worry if the concept of Mesh is still unfamiliar.
// Detailed creation methods will be covered in the following Basic Objects section.
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

// Place object in space by setting its position.
box.x = 0;
box.y = 1;
box.z = -5;

scene.addChild(box);
```

::: info [Learning Guide]
Even if you're not yet familiar with how to compose objects, please lightly check the visual changes when adding various elements to the **Scene**. (Codes are for reference only!)
:::

## 3. Light Manager

To implement deep shading and realistic three-dimensionality beyond simply painting colors on objects, lights are needed.
**Scene** owns a **LightManager** internally, and integratedly manages various light sources registered here so they act organically throughout the scene.

```javascript
// Setup Ambient Light (Global environment light)
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

// Add Directional Light
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

// [Note] To see lighting effects, you must use materials reacting to light such as PhongMaterial.
// const material = new RedGPU.Material.PhongMaterial(redGPUContext);
```

## 4. Practical Example

Configure a completed scene by combining object adding and lighting setup learned earlier.
We used a **TorusKnot** model that shows three-dimensionality well, and activated **Grid** and **Axis** to grasp the sense of space.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Setup Light
    const dirLight = new RedGPU.Light.DirectionalLight();  
    scene.lightManager.addDirectionalLight(dirLight);

    // 2. Add Object (TorusKnot)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // 3. Link View and activate debugging tools
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
        mesh.rotationX += 0.5;
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Scene Complete" slugHash="scene-complete">
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

    // Lighting
    const dirLight = new RedGPU.Light.DirectionalLight();
  
    scene.lightManager.addDirectionalLight(dirLight);

    // Add Object (TorusKnot)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // View & Render
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
        mesh.rotationX += 0.5;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 5. Shared Model

**Scene** is a model with data and state to be rendered. Multiple **View3D** instances can refer to a single **Scene** instance simultaneously.

Through this, functions such as observing changes in objects or lights added to the same scene from different viewpoints (Camera) in real-time can be efficiently implemented.

```javascript
// Create one Scene (Shared data)
const sharedScene = new RedGPU.Display.Scene();

// Refer to the same Scene from multiple Views
const view1 = new RedGPU.Display.View3D(redGPUContext, sharedScene, camera1);
const view2 = new RedGPU.Display.View3D(redGPUContext, sharedScene, camera2);
```

::: tip [Multi-View Layout]
Refer to the Multi-View System section of the **[View3D](./view3d.md)** document for detailed instructions on placing multiple views on the screen and adjusting their sizes.
:::

---

## Next Steps

Since the **Scene** (stage) is ready, we now need to define the **viewpoint** to look at this stage.
Learn about **Camera**, which projects 3D space to 2D screens.

- **[Camera](./camera.md)**
