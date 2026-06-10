---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager"]
        ShadowMgr["ShadowManager"]
        PhysicsEngine["PhysicsEngine"]
        Children["Child Nodes (Mesh, Group)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Owns| ShadowMgr
        Scene -->|Owns| PhysicsEngine
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% Grayscale styles applied to all nodes
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ShadowMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style PhysicsEngine fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Children fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Scene

If **View3D** is the 'window' that displays the scene, **Scene** is the 'stage' that unfolds beyond that window. It acts as the highest root node of the **Scene Graph**, containing all 3D objects (Mesh, Group) and lights (Light) to be rendered.

## 1. Architecture and Role

A **Scene** goes beyond being a simple container and performs the following core functions:

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

*   **Hierarchy Management**: Manages parent-child relationships of objects through `addChild()` and `removeChild()` methods.
*   **Lighting Data Management**: Centrally manages lighting data that affects the entire scene through the included **LightManager**, using GPU buffers (Uniform Buffers).

## 2. Object Management (Hierarchy)

The most basic role of a **Scene** is to hold the 3D objects to be rendered. Created objects must be added to the scene via `addChild()` to appear on the screen.

```javascript
// 1. Create a Scene
const scene = new RedGPU.Display.Scene();

// 2. Create and add a 3D object (Mesh)
// Don't worry if the concept of a Mesh is still unfamiliar.
// Detailed creation methods will be covered in the following Basic Objects section.
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

// Place the object in space by setting its position.
box.x = 0;
box.y = 1;
box.z = -5;

scene.addChild(box);
```

::: info [Learning Guide]
Even if you are not yet familiar with how to compose objects, observe the visual changes when adding various elements to the **Scene**. (The code provided is for reference only.)
:::

## 3. Light Manager

To implement deep shading and realistic three-dimensionality, rather than simply painting colors on objects, lights are required. A **Scene** owns a **LightManager** internally and centrally manages various registered light sources so they act organically throughout the scene.

```javascript
// Set up Ambient Light (Global environment light)
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

// Add a Directional Light
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

// [Note] To see lighting effects, you must use materials that react to light, such as PhongMaterial.
// const material = new RedGPU.Material.PhongMaterial(redGPUContext);
```

## 4. Practical Example

Configure a complete scene by combining the object addition and lighting setup learned earlier. We've used a **TorusKnot** model, which highlights three-dimensionality well, and activated **Grid** and **Axis** to provide a sense of space.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Set up Light
    const dirLight = new RedGPU.Light.DirectionalLight();  
    scene.lightManager.addDirectionalLight(dirLight);

    // 2. Add an Object (TorusKnot)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // 3. Link the View and activate debugging tools
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

    // Add an Object (TorusKnot)
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

## 5. Key API Properties and Methods

The `Scene` class provides various APIs for background clearing, light/shadow management, physics engine binding, and
hierarchical child management.

### 5.1 Background Color Configuration

* **`backgroundColor`** (`ColorRGBA`): The background color filled when clearing the scene. Must be assigned a valid
  `ColorRGBA` instance.
* **`useBackgroundColor`** (`boolean`, default: `false`): If set to `true`, background clearing with the specified
  `backgroundColor` is enabled.

### 5.2 Engine & Manager Integration

* **`lightManager`** (`LightManager`, Read-only): A manager that integrates and controls various light sources (Ambient,
  Directional, etc.) placed inside the scene.
* **`shadowManager`** (`ShadowManager`, Read-only): A manager that controls shadow map generation, resources, and
  computation pipelines.
* **`physicsEngine`** (`IPhysicsEngine`): Binds a physics engine plugin to run real-time physics simulations inside the
  scene.

### 5.3 Child Node Management (Inherited from Object3DContainer)

* **`addChild(child)`**: Registers a 3D object (Mesh) or a group (Group) as a child in the scene space. Only registered
  objects participate in the rendering cycle.
* **`removeChild(child)`**: Removes a specific child object from the scene graph, preventing it from being rendered.
* **`children`** (`any[]`, Read-only): Gets a list of all child nodes currently registered in the scene.

---

## 6. Shared Model

A **Scene** is a model that contains the data and state to be rendered. Multiple **View3D** instances can refer to a single **Scene** instance simultaneously.

Through this, features such as observing changes in objects or lights added to the same scene from different viewpoints (Cameras) in real-time can be efficiently implemented.

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

Since the **Scene** (stage) is ready, we now need to define the **viewpoint** from which to look at this stage. Learn about the **Camera**, which projects 3D space onto 2D screens.

- **[Camera](./camera.md)**