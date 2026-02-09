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

### Billboard Setup

| Property Name | Description | Default Value |
| :--- | :--- | :--- |
| **`useBillboard`** | Whether to always face the camera | `true` |

### Size and Rendering Mode

`Sprite3D` provides options to render in world units or fixed pixel sizes.

| Property Name | Description | Default Value |
| :--- | :--- | :--- |
| **`worldSize`** | Vertical size in world space (Unit). Horizontal size is automatically adjusted. | `1` |
| **`usePixelSize`** | Whether to use fixed pixel size mode. If `true`, it renders at a constant pixel size regardless of distance. | `false` |
| **`pixelSize`** | Fixed pixel size value (in `px`). Only applied when `usePixelSize` is `true`. | `0` |

```javascript
// 1. Set world unit size (shrinks with distance)
sprite.worldSize = 2;

// 2. Set fixed pixel size (UI style, size remains constant regardless of distance)
sprite.usePixelSize = true;
sprite.pixelSize = 64; 
```

### 3.3 Relationship between World Size and Pixel Size

Understanding the relationship between the key factors that determine size and clarity in `Sprite3D` allows for optimal presentation suited to each situation.

#### 3.3.1 Texture Resolution
- **Role**: The size of the original image determines the **maximum clarity** of the sprite.
- **Feature**: When using `usePixelSize` mode, setting `pixelSize` larger than the original resolution may result in a blurry image.

#### 3.3.2 World Size (`worldSize`)
- **Role**: Determines the **physical vertical height** (in Units) within the 3D world space.
- **Behavior**: Operates when `usePixelSize` is `false`, and perspective is applied based on distance like a general 3D object.

#### 3.3.3 Fixed Pixel Mode (`usePixelSize` & `pixelSize`)
- **Role**: Placed in 3D space, but displayed on the screen at the **specified pixel size**.
- **Feature**: When this mode is activated, `worldSize` is ignored. By default, the **original height** of the texture when loaded is automatically assigned to `pixelSize`. Use this when constant size and readability must be maintained regardless of distance, such as for icons or markers.

::: tip [Adjusting Pixel Size]
If the sprite appears too large or small while `usePixelSize` is active, adjust the `pixelSize` property directly instead of `worldSize`.
:::

## 4. Practical Example: Comparison by Rendering Mode

Let's place sprites with different settings in 3D space to check the visual differences.

<ClientOnly>
<CodePen title="RedGPU - Sprite3D Showcase" slugHash="sprite3d-showcase">
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

    // 1. Basic World Size
    const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite1.x = -3; sprite1.y = 1;
    sprite1.worldSize = 1.5;
    scene.addChild(sprite1);

    // 2. Fixed Pixel Size - size remains same even when moving away
    const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite2.x = 3; sprite2.y = 1;
    sprite2.usePixelSize = true;
    sprite2.pixelSize = 100;
    scene.addChild(sprite2);

    // 3. Option Description Label (TextField3D)
    const createLabel = (text, x, y) => {
        const label = new RedGPU.Display.TextField3D(redGPUContext, text);
        label.x = x; label.y = y;
        label.color = '#ffffff';
        label.fontSize = 16;
        label.background = '#ff3333';
        label.padding = 8;
        label.useBillboard = true;
        scene.addChild(label);
    };

    createLabel('World Size', -3, 2.5);
    createLabel('Pixel Size', 3, 2.5);

    // 3D View Setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    redGPUContext.addView(view);

    // Start Rendering
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## Key Summary

- **Sprite3D** provides a **Billboard** feature that faces the camera head-on while having a 3D coordinate system.
- You can implement UI-style elements that appear at a constant size regardless of distance via the `usePixelSize` property.
- Geometry size is automatically adjusted according to the resolution and ratio of the texture, making it convenient to use.

---

## Next Steps

Learn about animation effects using sprites.

- **[SpriteSheet3D](../sprite/spritesheet.md)**
