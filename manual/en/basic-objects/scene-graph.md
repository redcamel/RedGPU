---
title: Scene Graph
order: 2
---

<script setup>
const sceneGraph = `
    Scene["Scene (Root)"] --> ParentMesh["Parent Mesh"]
    ParentMesh --> ChildMesh1["Child Mesh A"]
    ParentMesh --> ChildMesh2["Child Mesh B"]
    ChildMesh2 --> GrandChild["Grandchild Mesh"]
`
</script>

# Scene Graph

**Scene Graph** refers to the hierarchical structure of objects placed in 3D space. In RedGPU, every **Mesh** can become a parent of another mesh, and the parent's transformation (position, rotation, scale) is inherited intact by the child.

## 1. Mesh Hierarchy

RedGPU's **Mesh** is an object with geometry and material, and at the same time, it acts as a container that can hold other meshes.

- **Parent Mesh**: A reference point containing child objects. If the parent moves, the child moves with it while maintaining its relative distance from the parent.
- **Child Mesh**: An object belonging to a parent. Its `x, y, z` coordinates are calculated as relative coordinates considering the parent's center point as `(0, 0, 0)`.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

## 2. Forming Hierarchy: addChild

You can register a specific mesh as a child of another mesh using the `addChild()` method of **RedGPU.Display.Mesh**.

```javascript
// Create Parent Mesh (Sun)
const sun = new RedGPU.Display.Mesh(redGPUContext, sunGeo, sunMat);
scene.addChild(sun);

// Create Child Mesh (Earth)
const earth = new RedGPU.Display.Mesh(redGPUContext, earthGeo, earthMat);

// Register Earth as a child of Sun
sun.addChild(earth);

// Now, earth.x = 5 means a position 5 units away from the Sun.
earth.x = 5;
```

## 3. Transformation Inheritance

State changes of the parent mesh affect all children.

1. **Position**: If the parent moves, the child moves together while attached to the parent.
2. **Rotation**: If the parent rotates around its axis, the child rotates around the parent's center as if orbiting.
3. **Scale**: If the parent's size doubles, the child's size and distance from the parent also double.

## 4. Practice: Orbit Model using Hierarchy

Let's see how the rotation of the parent mesh affects the child.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. Create Sun (Root Parent)
    const sun = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    // 2. Create Earth (Child of Sun)
    const earth = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    earth.x = 7; // Position 7 units away from Sun (Parent)
    sun.addChild(earth); // Add Earth to Sun

    // 3. Create Moon (Child of Earth)
    const moon = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    moon.x = 2; // Position 2 units away from Earth (Parent)
    earth.addChild(moon); // Add Moon to Earth

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        // Rotating the Sun causes its children Earth and Moon to orbit together.
        sun.rotationY += 1;
        
        // Rotating the Earth causes its child Moon to orbit around the Earth.
        earth.rotationY += 2;
    });
});
```

## Live Demo

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
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
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

## Key Summary

- Every **Mesh** can be a parent container and include child meshes.
- Child coordinates are always **relative coordinates** based on the parent's position.
- Parent's rotation and scale transformations are physically inherited by the child, making it easy to implement complex linked animations.

## Next Steps

Learn about PhongMaterial, a key material that creates three-dimensionality by reacting to light.

- **[Phong Material](../lighting-and-shadow/phong-material.md)**
