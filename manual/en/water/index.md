---
title: Water
order: 13
---

# Water System

RedGPU provides a **physically based Water** rendering pipeline that integrates seamlessly with open-world terrain
(`Landscape`) and standard 3D scenes.

Immediately after opaque geometry and large-scale terrain rendering complete, the pipeline captures screen color and
depth buffers to compute depth-based light attenuation (Beer-Lambert), refraction, underwater caustics, Screen Space
Reflections (**SSR**), and real-time wave ripple interactions.

## What You Will Learn

- **[Lake (Lake & Water Surface Simulation)](./lake.md)** : Controlling optical water materials and real-time 2D wave
  equation surface interactions using `RedGPU.Water.Lake` and `LakeMaterial`

---

## Related Examples

- [Basic Lake](/RedGPU/examples/3d/water/lake/basicLake/)
- [Lake Material](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [Water Wave Interaction](/RedGPU/examples/3d/water/lake/interaction/)
- [Lake with Landscape](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

[Next Step: Learn Lake](./lake.md)
