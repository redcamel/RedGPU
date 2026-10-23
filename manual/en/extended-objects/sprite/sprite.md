---
title: Sprite3D
order: 2
---

# Sprite3D

`Sprite3D` is a 2D plane display object placed in 3D space. It provides built-in
camera-facing **Billboard** behavior and automatic texture aspect ratio preservation, making it ideal for icons,
markers, and visual effects.

## 1. Basic Usage

`Sprite3D` uses a plane geometry internally and is instantiated with a material such as `BitmapMaterial`.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create Texture and Material
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 2. Create and Add Sprite
const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
scene.addChild(sprite);
```

---

## 2. Billboard and Size Control

`Sprite3D` supports both perspective-aware world unit sizing (`worldSize`) and distance-independent fixed screen pixel
sizing (`pixelSize`).

| Property           | Type      | Default | Description                                                                                                                            |
|:-------------------|:----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------|
| **`useBillboard`** | `boolean` | `true`  | Whether the sprite always faces the camera                                                                                             |
| **`worldSize`**    | `number`  | `1`     | Vertical height in world units when `usePixelSize` is `false` (horizontal width is scaled automatically by texture aspect ratio)       |
| **`usePixelSize`** | `boolean` | `false` | Enables fixed pixel size mode (`true` ignores `worldSize` and renders at a constant screen size regardless of camera distance)         |
| **`pixelSize`**    | `number`  | `0`     | Vertical height in screen pixels (`px`) when `usePixelSize` is `true` (automatically initialized to the source texture height on load) |

```javascript
// 1. World unit size mode (scales with camera distance)
sprite.worldSize = 2;

// 2. Fixed pixel size mode (remains 64px regardless of distance)
sprite.usePixelSize = true;
sprite.pixelSize = 64; 
```

> [!TIP]
> When `usePixelSize: true` is active, adjust `pixelSize` instead of `worldSize` to change the rendered size. Setting
`pixelSize` larger than the source texture resolution may cause blurring.

---

## 3. Practical Example: Comparison by Rendering Mode

Places world-sized (`worldSize`) and fixed-pixel-sized (`usePixelSize`) sprites side by side in 3D space to compare how
they respond to camera distance.

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

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    // Create shared material
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 1. Basic World Size
    const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite1.x = -3; sprite1.y = 1;
    sprite1.worldSize = 1.5;
    scene.addChild(sprite1);

    // 2. Fixed Pixel Size - size remains constant regardless of distance
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

## Related Examples

- [Sprite3D Basics](/RedGPU/examples/3d/sprite/sprite3D/)
- [Sprite3D Option Comparison](/RedGPU/examples/3d/sprite/sprite3DCompare/)
- [Sprite3D Mouse Events](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)

---

## Next Steps

- **[SpriteSheet3D](./spritesheet.md)**: Implementing frame animations using sprite sheet images
