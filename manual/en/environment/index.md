---
title: Environment
order: 6
---

# Environment

RedGPU provides realistic spatial environments through 3D scene background rendering, image-based global illumination,
physically based atmospheric scattering, and a global wind system.

## Main Learning Topics

- **[SkyBox](./skybox.md)**: Renders an infinite 360-degree scene background using a cubemap or HDR environment texture
  (`SkyBox`).
- **[IBL](./ibl.md)**: Analyzes surrounding environment images to apply realistic reflections and diffuse ambient
  lighting to PBR materials (`IBL`).
- **[SkyAtmosphere](./skyatmosphere.md)**: Simulates real-time atmospheric scattering and aerial perspective based on
  sun elevation and atmospheric density (`SkyAtmosphere`).
- **[Global Wind System](./wind.md)**: Controls wind direction, speed, and strength across foliage, grass, and water
  surfaces via `scene.windManager` (`WindManager`).

> [!NOTE]
> **Tone Mapping**, which fine-tunes the final screen color balance, is covered in the Post-Effects section.

---

[Next Step: Learn SkyBox](./skybox.md)
