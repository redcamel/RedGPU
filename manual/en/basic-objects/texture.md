---
title: Texture
order: 3
---

# Texture

Applying real photos or drawings to the surface of an object, rather than simple colors, allows you to create much more realistic 3D objects. RedGPU loads image files as **BitmapTexture** and applies them to objects using **BitmapMaterial**.

## 1. Loading Images: BitmapTexture

To use an image in a 3D engine, you must first convert it into a texture object. Using **RedGPU.Resource.BitmapTexture**, you can create texture data from an image path on the web.

```javascript
// Create texture data by specifying image path
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);
```

## 2. Applying to Material: BitmapMaterial

The loaded texture is used as the appearance of the mesh through **BitmapMaterial**. You can specify it directly in the constructor or assign it to the `diffuseTexture` property.

```javascript
// 1. Create material using texture
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. Create Mesh and apply material
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## 3. Understanding Asynchronous Loading

Image files take time to load because they are downloaded over the network. RedGPU waits in a default state (usually black) while the image is loading, and **automatically displays the texture on the screen as soon as loading is complete**.

It is very convenient because the engine internally manages the state without the developer having to write separate logic to check for loading completion.

## 4. Practice: Creating a Textured Box

Let's load a real image and apply it to a rotating box.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create Texture
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    // 2. Create Bitmap Material and link texture
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 3. Create Mesh (Box)
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
- **BitmapMaterial** is a dedicated material for expressing object surfaces using textures.
- RedGPU provides convenience by automatically handling asynchronous image loading.

## Next Steps

Learn how to add depth to space by adding light beyond simple images.

- **[Light](./light.md)**
