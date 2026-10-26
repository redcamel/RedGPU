---
title: Water
order: 13
---

# Water System

<img src="/water/lake.jpg" alt="Water" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:16px;" />

RedGPU provides a physically based water (`Water`) system that integrates seamlessly with terrain (`Landscape`) and
standard 3D scenes.

Using **2-Pass rendering** that captures the background color and depth buffers immediately after opaque geometry
rendering, it handles depth-based light attenuation (Beer-Lambert), underwater refraction, caustics, Screen Space
Reflections (**SSR**), and real-time wave ripple interactions.

---

## Key Components

| Category                   | Class                                         | Description                                                                                                             |
|:---------------------------|:----------------------------------------------|:------------------------------------------------------------------------------------------------------------------------|
| **Lake Surface Mesh**      | **[`Lake`](./lake.md)** (`RedGPU.Water.Lake`) | Lake water mesh supporting vertex waves and GPU 2D wave simulation (object collision ripples)                           |
| **Optical Water Material** | **`LakeMaterial`**                            | Automatically assigned to `lake.material`; controls depth colors, turbidity, refraction, normal maps, caustics, and SSR |

---

## Related Examples

- [Basic Lake](/RedGPU/examples/3d/water/lake/basicLake/)
- [Lake Material](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [Water Wave Interaction](/RedGPU/examples/3d/water/lake/interaction/)
- [Character Walking Ripples](/RedGPU/examples/3d/water/lake/characterWalking/)
- [Multi Lake](/RedGPU/examples/3d/water/lake/multiLake/)
- [Lake with Landscape](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

[Next Step: Learn Lake](./lake.md)
