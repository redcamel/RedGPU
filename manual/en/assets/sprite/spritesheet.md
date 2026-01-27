---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

**SpriteSheet3D** is an object that implements continuous motion in 3D space using a **Sprite Sheet** containing multiple animation frames in a single image. It is useful when placing dynamic 2D animations such as explosion effects, flames, or walking characters in 3D space.

## 1. Understanding Sprite Sheets

A sprite sheet is a single large texture with multiple frame images arranged in a grid. RedGPU completes the animation by dividing this texture into designated segments and displaying them sequentially frame by frame.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 2. Basic Usage

To use a sprite sheet, you must first create a **SpriteSheetInfo** object that defines the structure of the sheet and then pass it to **SpriteSheet3D**.

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

## 3. Animation Control

You can control the playback state of the animation in real-time through the `SpriteSheet3D` instance.

- **`play()`**: Starts the animation.
- **`stop()`**: Pauses the animation at the current frame.
- **`gotoAndPlay(frameIndex)`**: Moves to the specified frame and plays immediately.
- **`gotoAndStop(frameIndex)`**: Moves to the specified frame and stops.

## 4. Practical Example: Walking Character Animation

See how a grid-type sheet image transforms into a natural character motion through `SpriteSheet3D` and **Billboard** settings.

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

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create SpriteSheetInfo (5x3 grid, 15 frames, 24FPS)
    const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );

    // 2. Basic Billboard (Perspective ON)
    const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet1.x = -3; spriteSheet1.y = 1;
    scene.addChild(spriteSheet1);

    // 3. Disable Billboard (Plane fixed in space)
    const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet2.x = 0; spriteSheet2.y = 1;
    spriteSheet2.useBillboard = false;
    scene.addChild(spriteSheet2);

    // 4. Fixed Size Billboard (Perspective OFF)
    const spriteSheet3 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
    spriteSheet3.x = 3; spriteSheet3.y = 1;
    spriteSheet3.useBillboardPerspective = false;
    scene.addChild(spriteSheet3);

    // 5. Option Description Label (TextField3D)
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
    controller.distance = 10;
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

- **SpriteSheetInfo**: Defines image source, sheet grid structure (Segments), animation speed (FPS), etc.
- **Animation Control**: Control visual flow through methods like `play`, `stop`, `gotoAndPlay`.
- **Efficiency**: Beneficial in terms of network overhead and GPU memory management by using a single sheet file instead of loading multiple images individually.
