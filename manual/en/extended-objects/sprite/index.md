---
title: Sprite & SpriteSheet
order: 3
---

# Sprite & SpriteSheet

RedGPU's sprite system renders 2D images and frame-based animations in both 3D space (`View3D`) and 2D screen space
(`View2D`). It provides built-in camera-facing **Billboard** support and automatic texture aspect ratio adjustment.

## 1. Main Components

| Class                 | Namespace        | Description                                                                                             |
|:----------------------|:-----------------|:--------------------------------------------------------------------------------------------------------|
| **`Sprite3D`**        | `RedGPU.Display` | Billboard sprite object displaying a single image in 3D space                                           |
| **`SpriteSheet3D`**   | `RedGPU.Display` | Sprite sheet object playing frame-based animations in 3D space                                          |
| **`Sprite2D`**        | `RedGPU.Display` | 2D sprite object placed in `View2D` pixel coordinates                                                   |
| **`SpriteSheet2D`**   | `RedGPU.Display` | 2D sprite sheet object playing frame-based animations in `View2D` pixel coordinates                     |
| **`SpriteSheetInfo`** | `RedGPU.Display` | Data object defining sprite sheet grid structure (horizontal/vertical segments, frame count, FPS, etc.) |

---

## Learning Roadmap

1. **[Sprite3D](./sprite.md)**: Configuring 3D billboard sprites using a single image
2. **[SpriteSheet3D](./spritesheet.md)**: Controlling frame animations using sprite sheets

---

[Next Step: Learn Sprite3D](./sprite.md)
