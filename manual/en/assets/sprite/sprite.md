---
title: Sprite3D
order: 2
---

# Sprite3D

**Sprite3D** is a 2D plane object placed within 3D space. Unlike general meshes, it has a built-in **Billboard** feature, making it optimized for implementing elements that must always face the front regardless of the camera's rotation (icons, name tags, special effects, etc.).

## 1. Key Features

- **Billboard**: Supports the function to always face the camera by default.
- **Automatic Aspect Ratio**: Automatically calculates the aspect ratio of the assigned texture to adjust the size of the plane.
- **UI Friendly**: Combines position in 3D space (World Position) with 2D expression methods to provide UI elements with a sense of space.

## 2. Basic Usage

`Sprite3D` internally uses **Plane** geometry and is used with **BitmapMaterial** to output images.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create Texture and Material
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. Create and Add Sprite
const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
scene.addChild(sprite);
```

## 3. Key Property Control

Key properties controlling the sprite's billboard behavior and visual representation.

| Property Name | Description | Default Value |
| :--- | :--- | :--- |
| **`useBillboard`** | Whether to always face the camera | `true` |
| **`useBillboardPerspective`** | Whether to apply perspective (size change) based on distance from the camera | `true` |

```javascript
// Set icon style where size remains constant regardless of distance
sprite.useBillboard = true;
sprite.useBillboardPerspective = false; 
```

## 4. Practical Example: Comparison by Billboard Type

Let's place sprites with three different settings in 3D space to check the visual differences according to billboard options.

<ClientOnly>
<CodePen title="RedGPU - Sprite3D Billboard Showcase" slugHash="sprite3d-showcase">
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
    
    // Create shared material
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 1. Basic Billboard (Perspective ON)
    const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite1.x = -3; sprite1.y = 1;
    scene.addChild(sprite1);

    // 2. Disable Billboard (Plane fixed in space)
    const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite2.x = 0; sprite2.y = 1;
    sprite2.useBillboard = false;
    scene.addChild(sprite2);

    // 3. Fixed Size Billboard (Perspective OFF)
    const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3.x = 3; sprite3.y = 1;
    sprite3.useBillboardPerspective = false;
    scene.addChild(sprite3);

    // 4. Option Description Label (TextField3D)
    const createLabel = (text, x, y) => {
        const label = new RedGPU.Display.TextField3D(redGPUContext, text);
        label.x = x; label.y = y;
        label.color = '#ffffff';
        label.fontSize = 16;
        label.background = '#ff3333';
        label.padding = 8;
        label.useBillboard = true; // Labels always face front
        scene.addChild(label);
    };

    createLabel('Billboard ON', -3, 2.2);
    createLabel('Billboard OFF', 0, 2.2);
    createLabel('Perspective OFF', 3, 2.2);

    // 3D View Setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // Start Rendering
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## Key Summary

- **Sprite3D** provides a **Billboard** feature that faces the camera head-on while having a 3D coordinate system.
- You can implement UI-style elements that appear at a constant size regardless of distance via the `useBillboardPerspective` property.
- Geometry size is automatically adjusted according to the resolution and ratio of the texture, making it convenient to use.

---

## Next Steps

Learn about animation effects using sprites.

- **[SpriteSheet3D](../sprite/spritesheet.md)**
