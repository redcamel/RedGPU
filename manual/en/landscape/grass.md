---
title: Procedural Grass
order: 4
---

# Procedural Grass

`RedGPU.Landscape.GrassManager` scatters millions of grass blades across the terrain around
the camera in **16m × 16m cells**, baking instances on the fly in GPU compute shaders (`GrassCellBaker`) and rendering
them with **Two-Sided Foliage PBR**.

## 1. Key Features

- **Zero-CPU 16m Cell Baking**: Generates grass positions, rotations, and scales directly on the GPU within 16m cells
  inside `cullDistance` by referencing the Virtual Height Texture (VHT) and terrain splat weights.
- **Procedural Blade & Custom Mesh Support**: Generates multi-segment procedural grass blades out of the box when no
  `mesh` is provided, or scatters custom flower/weed meshes (`mesh`) loaded from glTF.
- **Two-Sided Foliage PBR & Ground Blending**: Supports **Subsurface Scattering** when backlit by
  the sun, and blends blade roots with the underlying terrain's Virtual Blend Texture (**VBT**) color via
  `groundBlendStrength`.

## 2. Registering Grass Types (`grassManager.addType`)

Call `landscape.grassManager.addType(options)` to register one or more grass types (`Grass`).

```javascript
// Register procedural grass on the 'Grass' terrain layer
const meadowGrass = landscape.grassManager.addType({
    name: 'MeadowGrass',
    targetLayer: 'Grass',           // Spawn where the 'Grass' layer weight is high
    densityPerSquareMeter: 25,      // 25 blades per square meter (1㎡)
    cullDistance: 80,               // Render within 80m of the camera
    bladeWidth: 0.08,               // Blade width (meters)
    bladeHeight: 0.65,              // Blade height (meters)
    heightVariance: 0.35,           // Random height variation (0.0 ~ 1.0)
    baseColor: [0.12, 0.28, 0.06],  // Root color (RGB 0~1)
    tipColor: [0.38, 0.58, 0.16],   // Tip color (RGB 0~1)
    subsurfaceColor: [0.45, 0.72, 0.2],
    subsurfaceStrength: 0.35,       // Backlit subsurface scattering strength
    groundBlendStrength: 0.85,      // Color blending strength with terrain ground
    windStrength: 1.0,              // Wind sway intensity multiplier
    windFrequency: 1.2              // Wind wave frequency
});
```

## 3. `GrassOptions` Key Properties

| Property                             | Default              | Description                                                                                   |
|:-------------------------------------|:---------------------|:----------------------------------------------------------------------------------------------|
| **`name`**                           | Required             | Unique identifier name for the grass type                                                     |
| **`mesh`**                           | `null`               | Custom grass/wildflower `Mesh` (`null` uses built-in procedural grass blades)                 |
| **`targetLayer`**                    | `''`                 | Name or index of the `LandscapeLayer` used for placement weights                              |
| **`densityPerSquareMeter`**          | `15.0`               | Baseline instance count per square meter (`1㎡`)                                              |
| **`densityMultiplier`**              | `1.0`                | Real-time multiplier applied to the baseline density                                          |
| **`cullDistance`**                   | `60.0`               | Maximum visible distance from the camera (`fadeStartRatio` controls smooth distance fade-out) |
| **`bladeWidth` / `bladeHeight`**     | `0.15` / `0.9`       | Width and height of procedural grass blades                                                   |
| **`heightVariance`**                 | `0.4`                | Random height variation across individual blades (`0.0 ~ 1.0`)                                |
| **`minSlope` / `maxSlope`**          | `0.0` / `35.0`       | Minimum and maximum terrain slope angles allowed for placement (in degrees)                   |
| **`windStrength` / `windFrequency`** | `0.25` / `1.2`       | Sway amplitude and wave frequency driven by `scene.windManager`                               |
| **`baseColor` / `tipColor`**         | RGB `[r,g,b]`        | Root (`baseColor`) and tip (`tipColor`) colors of grass blades                                |
| **`subsurfaceStrength`**             | `0.25`               | Backlit subsurface scattering intensity (`0.0 ~ 3.0`)                                         |
| **`subsurfaceColor`**                | `[0.35, 0.65, 0.15]` | Subsurface scattering RGB color (`0.0 ~ 1.0`)                                                 |
| **`groundBlendStrength`**            | `1.0`                | Blending strength with terrain ground color (VBT) and normal (`0.0 ~ 1.0`)                    |
| **`receiveShadow` / `castShadow`**   | `true` / `true`      | Enables shadow receiving and casting                                                          |

---

## Next Step

Now that terrain and vegetation are set up, explore the physically based water system that interacts seamlessly with
terrain for refraction, caustics, and real-time wave ripples.

- **[Water System (Water)](../water/index.md)**
- **[Physically Based Lake (Lake)](../water/lake.md)**
- **[Global Wind System (WindManager)](../environment/wind.md)**

---

## Related Examples

- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)
