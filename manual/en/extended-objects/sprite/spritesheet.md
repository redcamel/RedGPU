---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

`SpriteSheet3D` is a 3D display object that divides a grid-based **Sprite Sheet**
texture into designated segments and plays its frames sequentially.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 1. Basic Usage

Create a `SpriteSheetInfo` instance defining the grid layout and playback speed, then pass it to the `SpriteSheet3D`
constructor.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Define Sprite Sheet Info
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png', 
    5, 3, // 5 horizontal segments, 3 vertical segments
    15,   // Total frames
    0,    // Start frame index
    true, // Loop playback
    24    // Frames per second (FPS)
);

// 2. Create and Add SpriteSheet3D Instance
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
scene.addChild(spriteSheet);
```

---

## 2. Animation and Size Control

Provides frame playback control methods alongside the same billboard and sizing properties as `Sprite3D`.

| Property / Method             | Default | Description                                                                                 |
|:------------------------------|:--------|:--------------------------------------------------------------------------------------------|
| **`play()` / `stop()`**       | -       | Starts animation playback or pauses at the current frame.                                   |
| **`gotoAndPlay(frameIndex)`** | -       | Moves to the specified frame index and plays immediately.                                   |
| **`gotoAndStop(frameIndex)`** | -       | Moves to the specified frame index and pauses.                                              |
| **`useBillboard`**            | `true`  | Whether the sprite sheet always faces the camera                                            |
| **`worldSize`**               | `1`     | Vertical height in world units when `usePixelSize` is `false`                               |
| **`usePixelSize`**            | `false` | Enables fixed pixel size mode (`true` renders at `pixelSize` regardless of camera distance) |
| **`pixelSize`**               | `0`     | Fixed vertical height in screen pixels (`px`) when `usePixelSize` is `true`                 |

```javascript
// Display character animation at a fixed pixel size
spriteSheet.usePixelSize = true;
spriteSheet.pixelSize = 128;
```

> For details on how `worldSize` and `usePixelSize` interact, refer to the **[Sprite3D manual](./sprite.md)**.

---

## 3. Practical Example: Character Sprite Animation

Plays a 5x3 grid sprite sheet (`SpriteSheetInfo`) in both world size mode and fixed pixel size mode.

<ClientOnly>
<CodePen title="RedGPU - SpriteSheet3D Animation" slugHash="spritesheet3d-basic">
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

    // 1. Create SpriteSheetInfo (5x3 grid, 15 frames, 24FPS)
    const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );

    // 2. World Size Sprite Sheet
    const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet1.x = -3; spriteSheet1.y = 1;
    spriteSheet1.worldSize = 2;
    scene.addChild(spriteSheet1);

    // 3. Fixed Pixel Size Sprite Sheet
    const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet2.x = 3; spriteSheet2.y = 1;
    spriteSheet2.usePixelSize = true;
    spriteSheet2.pixelSize = 150;
    scene.addChild(spriteSheet2);

    // 4. Option Description Label (TextField3D)
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
    controller.distance = 10;
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

## Next Steps

- **[TextField3D](../text-field/textfield3d.md)**: Constructing and placing text labels in 3D space
