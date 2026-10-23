---
title: Procedural Grass
order: 4
---

# Procedural Grass

`RedGPU.Landscape.GrassManager` scatters and culls hundreds of thousands to millions of grass and vegetation clumps
across the terrain around the camera in **16m cells directly in GPU compute shaders**.

---

## 1. Registering Grass Types (`grassManager.addType`)

Prepare a grass clump `Mesh` and call `landscape.grassManager.addType(options)` to register it. Call `addType()`
multiple times to mix several grass varieties or wildflowers.

- **Two-Sided Foliage PBR & Subsurface Scattering**: Supports backlit transmission (`subsurfaceStrength`,
  `subsurfaceColor`) through thin blades and ground color blending (`groundBlendStrength`) that blends the underlying
  terrain color into grass roots.
- **Global Wind Synchronization**: Automatically animates vertex wind sway based on `scene.windManager` direction and
  speed.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/terrain/grass.glb',
    (loader) => {
        const grass = landscape.grassManager.addType({
            name: 'Lawn Clump',
            mesh: loader.resultMesh,            // Source grass clump Mesh to instance
            densityPerHectare: 20000,           // 20,000 instances per hectare (10,000㎡)
            cullingDistance: 110,               // Maximum visible distance (110m)
            targetLayer: 'Grass',               // Spawn only on the 'Grass' terrain layer
            maxSlope: 35,                       // Spawn only on slopes up to 35 degrees
            minScale: [12.0, 8.0, 12.0],        // Minimum random scale [x, y, z]
            maxScale: [18.0, 12.0, 18.0],       // Maximum random scale [x, y, z]
            roughness: 0.55,
            subsurfaceStrength: 0.35,           // Backlit subsurface scattering (SSS) strength
            subsurfaceColor: [0.35, 0.65, 0.15],
            groundBlendStrength: 0.85,          // Root color blending strength with terrain ground (VBT)
            receiveShadow: true,
            castShadow: true
        });
    }
);
```

### Live Example: Procedural Grass

<iframe src="/RedGPU/examples/3d/landscape/proceduralGrass/" style="width:100%; height:500px;"></iframe>

---

## 2. `GrassOptions` Key Properties

| Category              | Property                               | Default                     | Description                                                                                 |
|:----------------------|:---------------------------------------|:----------------------------|:--------------------------------------------------------------------------------------------|
| **Identity & Mesh**   | **`name`**                             | Required                    | Unique identifier name for the grass type                                                   |
|                       | **`mesh`**                             | Required                    | Source `Mesh` instance from which grass geometry and default textures are extracted         |
|                       | **`baseColorTexture`**                 | From mesh material          | Grass base color texture path or `BitmapTexture`                                            |
| **Density & Culling** | **`densityPerHectare`**                | `5000.0`                    | Baseline placement density per hectare (10,000㎡)                                           |
|                       | **`densityMultiplier`**                | `1.0`                       | Real-time multiplier applied to the baseline density                                        |
|                       | **`cullingDistance`**                  | `100.0`                     | Maximum camera distance at which grass is rendered (with automatic distance scale fade-out) |
|                       | **`targetLayer`**                      | `''`                        | Name or index of the `LandscapeLayer` referenced for placement density                      |
| **Transform & Slope** | **`minSlope`** / **`maxSlope`**        | `0.0` / `35.0`              | Minimum and maximum terrain slope angles allowed for growth (in degrees)                    |
|                       | **`minScale`** / **`maxScale`**        | `[0.7, 0.7]` / `[1.3, 1.4]` | Per-instance random scale range (`[width, height]` or `[x, y, z]`)                          |
|                       | **`bottomOffset`**                     | `0.0`                       | Vertical (Y) offset relative to the terrain surface                                         |
| **Material & PBR**    | **`alphaCutoff`**                      | `0.2`                       | Texture alpha mask cutoff threshold (`0.01 ~ 1.0`)                                          |
|                       | **`roughness`**                        | `0.55`                      | Grass surface roughness (`0.04 ~ 1.0`)                                                      |
|                       | **`subsurfaceStrength`**               | `0.25`                      | Backlit subsurface scattering intensity (`0.0 ~ 3.0`)                                       |
|                       | **`subsurfaceColor`**                  | `[0.35, 0.65, 0.15]`        | Subsurface scattering RGB color (`0.0 ~ 1.0`)                                               |
|                       | **`exposureBoost`**                    | `1.0`                       | Brightness exposure boost multiplier                                                        |
|                       | **`groundBlendStrength`**              | `1.0`                       | Bottom blending strength with terrain ground color (VBT) and normal (`0.0 ~ 1.0`)           |
| **Shadows**           | **`receiveShadow`** / **`castShadow`** | `true` / `true`             | Enables shadow receiving and casting                                                        |
|                       | **`shadowStrength`**                   | `1.0`                       | Darkness strength of received shadows (`0.0 ~ 1.0`)                                         |

---

## Related Examples

- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Water System](../water/index.md)
