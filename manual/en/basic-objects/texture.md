---
title: Texture
order: 3
---

# Texture

By applying real photos or illustrations to an object's surface instead of simple colors, you can create much more realistic 3D objects. In RedGPU, image files are loaded as **BitmapTexture** and applied to objects using **BitmapMaterial**.

## 1. Loading Images: BitmapTexture

To use an image in a 3D engine, you must first convert it into a texture object. Using **RedGPU.Resource.BitmapTexture**, you can create texture data from an image path on the web.

```javascript
// Create texture data by specifying the image path
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);
```

## 2. Applying to Material: BitmapMaterial

The loaded texture is used as the mesh's appearance through **BitmapMaterial**. You can specify it directly in the constructor or assign it to the `diffuseTexture` property.

```javascript
// 1. Create a material using the texture
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. Create a mesh and apply the material
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## 3. Understanding Asynchronous Loading

Image files take time to load because they are downloaded over the network. RedGPU remains in a default state (usually black) while the image is loading and **automatically displays the texture on the screen as soon as loading is complete**.

This is highly convenient because the engine manages the state internally, so developers don't have to write separate logic to check for loading completion.

## 4. Practice: Creating a Textured Box

Let's load a real image and apply it to a rotating box.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create a texture
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    // 2. Create a Bitmap Material and link the texture
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 3. Create a Mesh (Box)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        material
    );
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Texture" slugHash="mesh-texture">
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
    
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

- **BitmapTexture** converts external image files into resources for the 3D engine.
- **BitmapMaterial** is a dedicated material for representing object surfaces using textures.
- RedGPU provides convenience by automatically handling asynchronous image loading.

## Next Steps

Learn how to add depth to space by adding light, moving beyond simple images.

- **[조명](./light.md)**