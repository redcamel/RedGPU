---
title: Mesh
order: 1
---

<script setup>
const meshGraph = `
    Geometry["Geometry (Shape)"] -->|Compose| Mesh["Mesh (Object)"]
    Material["Material (Surface)"] -->|Compose| Mesh

    %% Grayscale styles applied
    style Geometry fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Mesh

`Mesh` is the fundamental display object rendered in 3D space, combining vertex shape data (`Geometry`) with surface
properties (`Material`).

<ClientOnly>
  <MermaidResponsive :definition="meshGraph" />
</ClientOnly>

---

## 1. Geometry and Primitives

**Geometry** is a collection of vertex positions, normals, and UV coordinates in 3D space. RedGPU provides procedural
built-in shapes called **Primitives** (`RedGPU.Primitive.*`) that can be instantiated immediately without external model
files.

| Class                     | Description                                     |
|:--------------------------|:------------------------------------------------|
| **`Box` / `RoundedBox`**  | Hexahedral box or box with rounded corners      |
| **`Sphere` / `Capsule`**  | Smooth sphere or capsule pill shape             |
| **`Cone` / `Cylinder`**   | Cone or cylinder shape                          |
| **`Plane` / `Ground`**    | 2D rectangular plane or subdivided ground plane |
| **`Circle` / `Ring`**     | Filled circular plane or hollow ring plane      |
| **`Torus` / `TorusKnot`** | Donut-shaped torus or twisted torus knot        |

---

## 2. Material Types

**Material** determines the surface color, textures, light reflectance, and transparency of an object.

| Class                | Features                                                          | Primary Usage                                          |
|:---------------------|:------------------------------------------------------------------|:-------------------------------------------------------|
| **`ColorMaterial`**  | Outputs solid color (RGB) and alpha without lighting calculations | Rapid visualization, prototyping, debugging            |
| **`BitmapMaterial`** | Maps a single texture (`BitmapTexture`) onto the surface          | Backgrounds, unlit textured objects                    |
| **`PhongMaterial`**  | Computes diffuse and specular highlight reflections               | Standard lit 3D objects                                |
| **`PBRMaterial`**    | Supports Metallic-Roughness workflow and glTF KHR extensions      | High-quality physically based photorealistic rendering |

```javascript
// 1. Opaque red material
const redMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

// 2. Translucent blue material (alpha: 0.0 ~ 1.0)
const blueAlphaMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');
blueAlphaMat.alpha = 0.5;
```

---

## 3. Spatial Transform and Key Properties

Position, rotation, and scale transformations of a `Mesh` operate relative to the object's **Pivot** point.

| Category        | Property                                  | Type / Default          | Description                                                                                                         |
|:----------------|:------------------------------------------|:------------------------|:--------------------------------------------------------------------------------------------------------------------|
| **Transform**   | **`x`, `y`, `z`**                         | `number` (`0`)          | Local coordinates in 3D space (supports `setPosition(x, y, z)`)                                                     |
| **Transform**   | **`rotationX`, `rotationY`, `rotationZ`** | `number` (`0`)          | Rotation angles per axis in degrees (supports `setRotation(x, y, z)`)                                               |
| **Transform**   | **`scaleX`, `scaleY`, `scaleZ`**          | `number` (`1`)          | Scale multipliers per axis (supports `setScale(x, y, z)`)                                                           |
| **Transform**   | **`pivotX`, `pivotY`, `pivotZ`**          | `number` (`0`)          | Reference pivot offset coordinates for translation, rotation, and scaling                                           |
| **Appearance**  | **`geometry`**                            | `Geometry \| Primitive` | Geometry instance bound to the mesh                                                                                 |
| **Appearance**  | **`material`**                            | `ABaseMaterial`         | Surface material instance bound to the mesh                                                                         |
| **Appearance**  | **`opacity`**                             | `number` (`1.0`)        | Mesh opacity (`0.0 ~ 1.0`, multiplied down to child nodes)                                                          |
| **Shadow**      | **`castShadow`**                          | `boolean` (`false`)     | Whether this mesh casts shadows onto other objects                                                                  |
| **Shadow**      | **`receiveShadow`**                       | `boolean` (`true`)      | Whether this mesh receives shadows cast by other objects                                                            |
| **Culling**     | **`ignoreFrustumCulling`**                | `boolean` (`false`)     | Bypasses camera frustum culling so the mesh is always rendered                                                      |
| **Culling**     | **`useScreenSpaceSizeCulling`**           | `boolean` (`true`)      | Skips draw calls when the projected screen-space size ratio falls below the threshold                               |
| **Culling**     | **`minScreenSpaceSize`**                  | `number` (`0.006`)      | Minimum screen-space size ratio threshold for screen-space culling                                                  |
| **Interaction** | **`enableWaterInteraction`**              | `boolean` (`false`)     | Generates real-time 2D water ripples when colliding or moving on a `Lake` surface (applied recursively to children) |
| **Interaction** | **`waterWaveStrength`**                   | `number` (`1.0`)        | Intensity multiplier for water ripples generated on a `Lake`                                                        |
| **Debug**       | **`enableDebugger`**                      | `boolean` (`false`)     | Displays the bounding volume (`OBB`/`AABB`) and normal debugger (`DrawDebuggerMesh`)                                |

```javascript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.setPosition(10, 0, 0);
mesh.rotationY = 45;
mesh.scaleX = 2;
```

---

## 4. Practical Example: Creating and Placing a Mesh

An example of combining primitive geometries with `ColorMaterial`, placing them in a scene, and rotating them.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.setPosition(0, 5, -15);
    camera.lookAt(0, 0, 0);

    // 1. Prepare geometry and basic material
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');

    // 2. Create Mesh and add to Scene
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    // 3. Setup View and Rendering
    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1; // Rotate Y-axis every frame
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Mesh Playground" slugHash="mesh-playground">
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
    camera.z = -15; camera.y = 8;
    camera.lookAt(0, 0, 0);

    // 1. Ground (White)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 50, 50),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    scene.addChild(floor);

    // 2. Torus (Yellow)
    const torus = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 3, 0.5),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffcc00')
    );
    torus.y = 2;
    scene.addChild(torus);

    // 3. Box (Blue)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    box.x = -6; box.y = 1;
    scene.addChild(box);

    // 4. TorusKnot (Red)
    const knot = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4d4f')
    );
    knot.x = 6; knot.y = 2.5;
    scene.addChild(knot);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        torus.rotationX += 0.5;
        torus.rotationY += 1;
        box.rotationY += 1;
        knot.rotationY += 2;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[Scene Graph](./scene-graph.md)**: Grouping objects into parent-child hierarchies for composite structures and
  linked animations
