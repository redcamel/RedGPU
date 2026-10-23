---
title: Scene Graph
order: 2
---

<script setup>
const sceneGraph = `
    Scene["Scene (Root)"] --> Group["Group Container (Group3D)"]
    Group --> ParentMesh["Parent Mesh (Parent)"]
    ParentMesh --> ChildMesh1["Child Mesh A (Child)"]
    ParentMesh --> ChildMesh2["Child Mesh B (Child)"]
    ChildMesh2 --> GrandChild["Grandchild Mesh (Grandchild)"]

    %% Grayscale styles applied
    style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Group fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style ParentMesh fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style ChildMesh1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style ChildMesh2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GrandChild fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Scene Graph

The **Scene Graph** is a parent-child hierarchical tree structure of 3D objects in which spatial transformations
(translation, rotation, scale) and opacity of a parent node (`Group3D`, `Mesh`) are automatically inherited by its child
nodes.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

---

## 1. Hierarchy Nodes and `Group3D`

Every display object in RedGPU inherits from `Object3DContainer` and can hold child nodes. When you need to group
multiple objects logically to control their translation, rotation, and scale together without rendering geometry or
material of its own, use `RedGPU.Display.Group3D` (or `RedGPU.Display.Group2D` in 2D views).

| Component                  | Role and Characteristics                                                                                                                                                |
|:---------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`Group3D` / `Group2D`**  | Lightweight container that is not rendered directly, serving only as a shared pivot and logical group for child objects                                                 |
| **Parent Node (`Parent`)** | Reference coordinate space containing child objects. When the parent moves, rotates, or scales, its children transform together while maintaining their relative offset |
| **Child Node (`Child`)**   | Object belonging to a parent. Its `x, y, z` coordinates are evaluated in **Local Space**, treating the parent's pivot as `(0, 0, 0)`                                    |

### Core Container Methods

- **`addChild(child)` / `removeChild(child)`**: Registers or removes a child object.
- **`children` / `numChildren`**: Queries the array of registered child objects and their count.

> For index-based insertion (`addChildAt`), order manipulation (`setChildIndex`, `swapChildren`), bulk removal
> (`removeAllChildren`), and other container methods, refer to the `Object3DContainer` API documentation.

```javascript
// 1. Create a logical container Group3D
const solarSystemGroup = new RedGPU.Display.Group3D('SolarSystem');
scene.addChild(solarSystemGroup);

// 2. Add Parent Mesh (Sun) to the group
const sun = new RedGPU.Display.Mesh(redGPUContext, sunGeo, sunMat);
solarSystemGroup.addChild(sun);

// 3. Register Child Mesh (Earth) under Sun (local offset x = 5 from Sun's center)
const earth = new RedGPU.Display.Mesh(redGPUContext, earthGeo, earthMat);
earth.x = 5;
sun.addChild(earth);
```

---

## 2. Practical Example: Orbit Model Using Hierarchy

An example that registers `earth` as a child of `sun` and `moon` as a child of `earth`, implementing orbital motion
purely through parent rotation.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. Create Sun (Root Parent)
    const sun = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    // 2. Create Earth (Child of Sun, relative distance 7)
    const earth = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    earth.x = 7;
    sun.addChild(earth);

    // 3. Create Moon (Child of Earth, relative distance 2)
    const moon = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    moon.x = 2;
    earth.addChild(moon);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sun.rotationY += 1;   // Rotating Sun orbits both Earth and Moon
        earth.rotationY += 2; // Rotating Earth orbits Moon around Earth
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Mesh Hierarchy" slugHash="mesh-hierarchy">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    const sun = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    const earth = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    earth.x = 7;
    sun.addChild(earth);

    const moon = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    moon.x = 2;
    earth.addChild(moon);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sun.rotationY += 1;
        earth.rotationY += 2;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Related Examples

- [Mesh Hierarchy](/RedGPU/examples/3d/mesh/hierarchy/)
- [Child Node Methods](/RedGPU/examples/3d/mesh/childMethod/)
- [Group3D Basics](/RedGPU/examples/3d/group3D/basic/)
- [World-to-Local Coordinate Transformation](/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)

---

## Next Steps

- **[Texture](./texture.md)**: Loading external images and compressed textures to map onto materials
