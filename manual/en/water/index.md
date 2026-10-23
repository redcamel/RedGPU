---
title: Water
order: 13
---

# Water System

RedGPU's **physically based Water** system is a rendering pipeline that captures screen color and depth buffers
immediately after opaque geometry and terrain (`Landscape`) rendering complete to compute depth-based light attenuation
(Beer-Lambert), refraction, underwater caustics, Screen Space Reflections (**SSR**), and real-time wave ripple
interactions.

---

## Core Components

| Class                 | Role & Description                                                                                                                                                                            |
|:----------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **[Lake](./lake.md)** | Lake water class that controls water surface mesh geometry, vertex waves, and real-time 2D wave equation surface interactions.                                                                |
| **`LakeMaterial`**    | Dedicated water material that controls optical properties including depth colors (`baseColor`, `deepColor`), turbidity, normal maps, underwater caustics, and Screen Space Reflections (SSR). |

---

## Next Steps

- **[Physically Based Lake Water](./lake.md)**: Controlling optical water materials and real-time wave interactions
  using `Lake` and `LakeMaterial`
