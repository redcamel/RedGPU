---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

**`SpriteSheet3D`** is an object that implements continuous motion in 3D space using a **Sprite Sheet** containing
multiple animation frames in a single image. It is useful when placing dynamic 2D animations such as explosion effects,
flames, or walking characters in 3D space.

## 1. Understanding Sprite Sheets

A sprite sheet is a single large texture with multiple frame images arranged in a grid. RedGPU completes the animation
by dividing this texture into designated segments and displaying them sequentially frame by frame.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 2. Basic Usage

To use a sprite sheet, you must first create a `SpriteSheetInfo` object that defines the structure of the sheet and then
pass it to `SpriteSheet3D`.

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

## 3. Key Property Control

Key properties controlling the playback state and the size of the sprite.

### 3.1 Animation Control

- **`play()`**: Starts the animation.
- **`stop()`**: Pauses the animation at the current frame.
- **`gotoAndPlay(frameIndex)`**: Moves to the specified frame and plays immediately.
- **`gotoAndStop(frameIndex)`**: Moves to the specified frame and stops.

### 3.2 Billboard and Size Settings

`SpriteSheet3D` provides the same billboard and size setting options as `Sprite3D`. For detailed differences between
modes and operating principles, please refer to the
**[Size Relationship section of the Sprite3D manual](./sprite.md#_3-3-relationship-between-world-size-and-pixel-size)**.

| Property Name      | Description                           | Default Value |
|:-------------------|:--------------------------------------|:--------------|
| **`useBillboard`** | Whether to always face the camera     | `true`        |
| **`worldSize`**    | Vertical size in world space (Unit).  | `1`           |
| **`usePixelSize`** | Whether to use fixed pixel size mode. | `false`       |
| **`pixelSize`**    | Fixed pixel size value (in `px`).     | `0`           |

```javascript
// Display character animation at a fixed pixel size
spriteSheet.usePixelSize = true;
spriteSheet.pixelSize = 128;
```

## 4. Practical Example: Sprite Sheet Animation Control

See how a grid-type sheet image operates as a continuous animation through `SpriteSheet3D`, and how FPS and playback
controls (`play`, `pause`, `stop`) are applied.

<iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>

---

## Related Examples

- [SpriteSheet3D Basics](/RedGPU/examples/3d/sprite/spriteSheet3D/)
- [SpriteSheet3D Option Comparison](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
- [SpriteSheet3D Mouse Events](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)

---

## Next Steps

Learn how to construct and place three-dimensional text labels within 3D space.

- **[TextField3D](../text-field/textfield3d.md)**
