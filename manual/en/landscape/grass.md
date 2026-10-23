---
title: Procedural Grass
order: 4
---

# Procedural Grass

`GrassManager` (`landscape.grassManager`) bakes and culls hundreds of thousands to millions of grass and vegetation
clumps in real time on GPU compute shaders across the terrain surface around the camera.

## 1. How It Works & Key Features

- **Camera-Centered 16m Cell GPU Baking**: Whenever the camera moves beyond a threshold (`16m` cell unit), the GPU
  compute pass (`GrassInstanceBaker`) samples the VHT (elevation), VNT (normal), and VBT (terrain color) atlases along
  with splatting weights to generate grass instances on the fly.
- **Two-Sided Foliage PBR & Subsurface Scattering**: Supports backlit **Subsurface Scattering** (`subsurfaceStrength`)
  through thin grass blades and **Ground Blending** (`groundBlendStrength`) that blends the terrain surface color into
  the blade roots.
- **Global Wind Integration**: Automatically applies vertex wind animation driven by the wind direction and speed of
  `scene.windManager`.

---

## 2. Registering Grass Types

Prepare a grass clump `Mesh` and register it by calling `landscape.grassManager.addType(options)`.

```javascript
// Register a terrain grass type using a grass mesh
const meadowGrass = landscape.grassManager.addType({
    name: 'MeadowGrass',
  mesh: grassBladeMesh,
  densityPerHectare: 80000,           // 80,000 instances per hectare
  cullingDistance: 100,               // Render up to 100m (automatic scale fade-out at far range)
  targetLayer: 'Grass',               // Spawn only on the 'Grass' terrain layer
  maxSlope: 30,                       // Spawn only on slopes of 30 degrees or less
  minScale: [0.8, 0.7],               // Minimum random scale [width, height]
  maxScale: [1.3, 1.4],               // Maximum random scale [width, height]
  roughness: 0.55,
  subsurfaceStrength: 0.35,           // Backlit subsurface scattering (SSS) intensity
  subsurfaceColor: [0.35, 0.65, 0.15],
  groundBlendStrength: 0.85,          // Bottom blending strength with terrain VBT color
  receiveShadow: true,
  castShadow: false
});
```

---

## 3. `GrassOptions` Key Properties

| Property                           | Default                     | Description                                                                        |
|:-----------------------------------|:----------------------------|:-----------------------------------------------------------------------------------|
| **`name`**                         | Required                    | Unique identifier name for the grass type                                          |
| **`mesh`**                         | Required                    | Source `Mesh` instance from which grass geometry and default texture are extracted |
| **`baseColorTexture`**             | From mesh material          | Grass base color texture path or `BitmapTexture`                                   |
| **`densityPerHectare`**            | `5000.0`                    | Baseline placement density per hectare (10,000㎡)                                  |
| **`densityMultiplier`**            | `1.0`                       | Density multiplier applied to the baseline density                                 |
| **`cullingDistance`**              | `100.0`                     | Maximum camera distance at which grass is rendered                                 |
| **`targetLayer`**                  | `''`                        | `LandscapeLayer` name or index referenced for placement density                    |
| **`minSlope` / `maxSlope`**        | `0.0` / `35.0`              | Minimum and maximum terrain slope angles allowed for grass growth (in degrees)     |
| **`minScale` / `maxScale`**        | `[0.7, 0.7]` / `[1.3, 1.4]` | Instance random scale range (`[width, height]` or `[x, y, z]`)                     |
| **`alphaCutoff`**                  | `0.2`                       | Texture alpha mask cutoff threshold (`0.01 ~ 1.0`)                                 |
| **`roughness`**                    | `0.55`                      | Grass surface roughness (`0.04 ~ 1.0`)                                             |
| **`subsurfaceStrength`**           | `0.25`                      | Backlit subsurface scattering intensity (`0.0 ~ 3.0`)                              |
| **`subsurfaceColor`**              | `[0.35, 0.65, 0.15]`        | Subsurface scattering RGB color (`0.0 ~ 1.0`)                                      |
| **`groundBlendStrength`**          | `1.0`                       | Bottom blending strength with terrain ground color (VBT) and normal (`0.0 ~ 1.0`)  |
| **`receiveShadow` / `castShadow`** | `true` / `true`             | Enables shadow receiving and casting                                               |

---

## Related Examples

- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

## Next Steps

- **[Water System](../water/index.md)**: Physically based water system interacting with terrain for refraction,
  caustics, and real-time wave ripples
- **[Physically Based Lake](../water/lake.md)**: Guide to configuring `Lake` and `LakeMaterial`
- **[Global Wind System](../environment/wind.md)**: Controlling wind direction and speed via `WindManager`
