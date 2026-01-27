---
title: Sprite & SpriteSheet
order: 1
---

# Sprite & SpriteSheet

RedGPU provides a **Sprite** system that allows you to effectively use 2D images in 3D space. You can bring your scene to life with the **Billboard** feature, which always faces the camera, and sprite sheets that support frame animation.

## 1. Key Features

- **Billboard Support**: Placed in 3D space but can be set to always face the camera, optimized for UI, particles, icons, etc.
- **Animation System**: Implement high-performance 2D animations using sheets containing multiple frames in a single texture.
- **Automatic Aspect Ratio**: The sprite's rendering ratio is automatically adjusted to match the texture size.

## 2. Main Components

| Class Name | Description |
| :--- | :--- |
| **`Sprite3D`** | A 3D sprite object using a single image. |
| **`SpriteSheet3D`** | A sprite sheet object supporting frame animation. |
| **`SpriteSheetInfo`** | A data object defining the structure (segments, frame count, etc.) of a sprite sheet. |

## Learning Roadmap

1.  **[Sprite3D](./sprite)**: Creating billboard sprites using a single image
2.  **[SpriteSheet3D](./spritesheet)**: Utilizing sprite sheets with animation

---

[Next Step: Learn TextField3D](../text-field/textfield3d.md)
