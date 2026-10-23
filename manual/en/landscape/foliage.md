---
title: Foliage & Impostors
order: 5
---

# Foliage & Impostors

`RedGPU.Landscape.FoliageManager` streams tens to hundreds of thousands of 3D meshes—such as trees, rocks, and
shrubs—across sub-cells on the terrain, combining multi-stage mesh LODs with **Octahedral Impostors** for high-speed
rendering.

---

## 1. Registering Foliage Types (`foliageManager.addType`)

Pass a model loaded via `GLTFLoader` or `Mesh` to `landscape.foliageManager.addType(options)` to register a foliage type
(`Foliage`).

- **`lods`**: Specifies an array of 3D mesh LOD configurations (`[{ mesh, lodDistance }]`) switched by camera distance.
- **`useImpostor: true` (default)**: Beyond the final 3D mesh LOD distance up to `cullingDistance`, instances
  automatically transition into runtime-baked **Octahedral Impostor** billboards to minimize draw calls.
- **`targetLayer`**: Automatically scatters vegetation only where a specific terrain splatting layer (e.g., `'Grass'`)
  has high weight.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/terrain/pine_tree.glb',
    (loader) => {
        const treeMesh = loader.resultMesh;

        const pineFoliage = landscape.foliageManager.addType({
            name: 'PineTree',
            lods: [
                { mesh: treeMesh, lodDistance: 120 } // 0 ~ 120m: Render 3D mesh
            ],
            useImpostor: true,          // 120m ~ cullingDistance: Auto-switch to octahedral impostor
            cullingDistance: 4000,      // Maximum visible distance (4000m)
            shadowCullDistance: 150,    // Shadow casting distance (150m)
            densityPerHectare: 120,     // Target instance density per hectare (10,000㎡)
            targetLayer: 'Grass',       // Distribute proportional to 'Grass' terrain layer weight
            minSlope: 0,
            maxSlope: 35,               // Place only on slopes up to 35 degrees
            minScale: [0.4, 0.4, 0.4],
            maxScale: [0.7, 0.75, 0.7],
            trunkBendScale: 1.0,        // Trunk bending multiplier driven by global wind (scene.windManager)
            leafFlutterScale: 1.0       // Leaf flutter multiplier driven by global wind
        });
    }
);
```

### Live Example: Foliage & Impostors

<iframe src="/RedGPU/examples/3d/landscape/foliageAndImpostors/" style="width:100%; height:500px;"></iframe>

---

## 2. `FoliageOptions` Key Properties

| Category                | Property                                      | Default         | Description                                                                               |
|:------------------------|:----------------------------------------------|:----------------|:------------------------------------------------------------------------------------------|
| **Identity & LOD**      | **`name`**                                    | Required        | Unique identifier name for the foliage type                                               |
|                         | **`lods`**                                    | Required        | Array of distance-based LOD configurations (`[{ mesh, lodDistance, receiveShadow }]`)     |
|                         | **`useImpostor`**                             | `true`          | Automatically bakes and uses distant Octahedral Impostors                                 |
|                         | **`cullingDistance`**                         | `200.0`         | Maximum visible distance from the camera at which instances are rendered                  |
| **Density & Placement** | **`densityPerHectare`**                       | `1000.0`        | Baseline placement density per hectare (10,000㎡)                                         |
|                         | **`densityMultiplier`**                       | `1.0`           | Real-time multiplier applied to the baseline density                                      |
|                         | **`targetLayer`**                             | `''`            | Name or index of the `LandscapeLayer` used to weight placement probability                |
|                         | **`densityScaleByWeight`**                    | `true`          | Whether to scale instance density proportional to `targetLayer` weight                    |
| **Transform & Slope**   | **`minSlope`** / **`maxSlope`**               | `0.0` / `45.0`  | Minimum and maximum terrain slope angles allowed for placement (in degrees)               |
|                         | **`minScale`** / **`maxScale`**               | `[1, 1, 1]`     | Per-instance random scale range `[x, y, z]`                                               |
|                         | **`alignToNormal`** / **`alignFactor`**       | `false` / `1.0` | Whether to align instance rotation with the terrain surface normal and alignment strength |
|                         | **`bottomOffset`**                            | `0.0`           | Vertical (Y) offset relative to the terrain surface                                       |
| **Ground Blend & Wind** | **`groundBlendStrength`**                     | `1.0`           | Blending strength between the foliage base and terrain surface color/normal (`0.0 ~ 1.0`) |
|                         | **`trunkBendScale`** / **`leafFlutterScale`** | `1.0` / `1.0`   | Trunk bending and leaf flutter multipliers reacting to `scene.windManager`                |
| **Shadows**             | **`castShadow`** / **`receiveShadow`**        | `true` / `true` | Enables shadow casting and receiving                                                      |
|                         | **`shadowCullDistance`**                      | `50.0`          | Maximum distance at which shadows are cast in the shadow pass                             |

---

## Related Examples

- [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Water System](../water/index.md)
