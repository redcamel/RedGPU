---
title: Mesh
order: 1
---

<script setup>
const meshGraph = `
    Geometry["Geometry (Shape)"] -->|Compose| Mesh["Mesh (Object)"]
    Material["Material (Surface)"] -->|Compose| Mesh
`
</script>

# Mesh

**Mesh** is the most basic object unit visually represented in RedGPU's 3D space. **Geometry**, which acts as the skeleton, and **Material**, which acts as the skin, are combined to form a complete object.

## 1. Components of a Mesh

A **Mesh** cannot exist independently and must combine the following two elements:

- **Geometry**: The physical **shape** of the object consisting of points, lines, and faces.
- **Material**: Determines the **surface** properties of the object, such as color, texture, and reflection.

<ClientOnly>
  <MermaidResponsive :definition="meshGraph" />
</ClientOnly>

## 2. Geometry & Primitive

**Geometry** is a collection of numerous **Vertex** data points in 3D space.

RedGPU provides basic shapes called **Primitives** to allow for quick **space configuration or visualization testing** before loading external model files. Using these allows you to design 3D structures immediately without complex data calculations.

| Type | Description |
| :--- | :--- |
| **Box** | Hexahedral box shape |
| **Sphere** | Smooth spherical shape |
| **Plane** / **Ground** | 2D plane or grid ground shape |
| **Cylinder** / **Circle** | Cylindrical or circular plane shape |
| **Torus** / **TorusKnot** | Ring or twisted knot shape |

## 3. Defining the Surface: Material

**Material** is a property that determines how an object's surface looks. It can define not only simple colors but also textures, reflectance, transparency, and more.

| Type | Features | Main Usage |
| :--- | :--- | :--- |
| **ColorMaterial** | Outputs only solid color and transparency (ignores lighting) | Quick visualization, prototyping, debugging |
| **BitmapMaterial** | Outputs an image (**Texture**) on the object surface | Backgrounds, simple image objects, 2D sprites |
| **PhongMaterial** | Expresses light, shadow, and highlights | Realistic 3D objects, emphasizing three-dimensionality |
| **PBRMaterial** | Supports Physically Based Rendering (**PBR**) | High-quality photorealistic rendering, metal/roughness expression |

The most basic **ColorMaterial** quickly renders only color values (RGB) and transparency (Alpha) without lighting calculations.

```javascript
// 1. Opaque red material
const redMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

// 2. Translucent blue material (alpha: 0.0 ~ 1.0)
const blueAlphaMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');
blueAlphaMat.alpha = 0.5; 
```

::: info [Various Materials]
Use **BitmapMaterial** to apply images, **PhongMaterial** to express light and shadow, and so on. These are covered in detail in the following chapters.
:::

## 4. Controlling the Mesh (Transformation)

The created **Mesh** object has properties that can be freely transformed within 3D space.

- **Position** (`x`, `y`, `z`): Specifies the position in space.
- **Rotation** (`rotationX`, `rotationY`, `rotationZ`): Adjusts the rotation value of the object. (Unit: Degree)
- **Scale** (`scaleX`, `scaleY`, `scaleZ`): Adjusts the size of the object by a multiplier.

::: tip [Pivot Guide]
All movement, rotation, and scaling operations are based on the object's **Pivot** point. For primitives, the geometric center of each shape becomes the reference point.
:::

```javascript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

mesh.x = 10;           // Move along X-axis
mesh.rotationY = 45;   // Rotate 45 degrees around Y-axis
mesh.scaleX = 2;       // Scale 2x along X-axis
```

## 5. Practice: Creating and Placing a Mesh

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.z = -15; 
    camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. Prepare box shape and basic material for testing
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
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
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

## Key Summary

- **Mesh** is the basic unit of a 3D object, combining **Geometry** and **Material**.
- **Primitive** refers to standard shape data for visualization testing and structural design.
- **ColorMaterial** is lightweight and suitable for checking colors without lighting.
- All transformations are based on the object's **Pivot** point.

## Next Steps

Learn how to group meshes into parent-child relationships to create complex structures.

- **[Scene Graph](./scene-graph.md)**