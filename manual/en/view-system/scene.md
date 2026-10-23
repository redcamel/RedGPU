---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (Root Scene)"]
        LightMgr["LightManager"]
        ShadowMgr["ShadowManager"]
        PhysicsEngine["PhysicsEngine"]
        Children["Child Nodes (Mesh, Group3D)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Owns| ShadowMgr
        Scene -->|Owns| PhysicsEngine
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% Grayscale styles applied
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

`Scene` is the **root container** (`Object3DContainer`) of the **Scene Graph** that centrally manages all 3D display
objects (`Mesh`, `Group3D`, etc.), lighting, shadows, natural environments, and physics engines placed in 3D space.

A `Scene` instance provides the following core capabilities:

- **3D Object Hierarchy Management**: Organizes 3D objects to render in a tree hierarchy (`children`) via
  `addChild(child)` and `removeChild(child)`.
- **Integrated Lighting & Shadow Control**: Owns `lightManager` and `shadowManager` by default to control scene-wide
  light sources and shadow quality.
- **Terrain, Water, Wind & Physics Integration**: Binds open-world terrain (`landscape`), water bodies (`addWater`),
  global wind (`windManager`), and physics engines (`physicsEngine`) per scene.

---

## 1. Architecture and Basic Usage

Created 3D objects must be registered via `scene.addChild()` to be rendered, and light sources are added through
`scene.lightManager`.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. Register light (LightManager)
    const dirLight = new RedGPU.Light.DirectionalLight();  
    scene.lightManager.addDirectionalLight(dirLight);

    // 2. Add 3D object (addChild)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // 3. Connect view and start rendering
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

---

## 2. Custom Scene Background Color

By default, viewports use `redGPUContext.backgroundColor`. Enabling `scene.useBackgroundColor = true` applies an
independent background color (`ColorRGBA`) specific to that `Scene`.

```javascript
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#1a1a2e');
```

---

## 3. Sharing a Scene Across Views

Connecting a single `Scene` instance to multiple `View3D` instances renders the same 3D space simultaneously from
different camera viewpoints.

```javascript
const sharedScene = new RedGPU.Display.Scene();

const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
const subView = new RedGPU.Display.View3D(redGPUContext, sharedScene, subCamera);
```

---

## Next Steps

- **[Camera](./camera.md)**: Projecting 3D space onto a 2D screen and configuring physical camera exposure
