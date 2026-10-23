---
title: Foliage & Impostors
order: 3
---

# Foliage & Impostors

`FoliageManager` (`landscape.foliageManager`) streams tens to hundreds of thousands of 3D meshes—such as trees, rocks,
and shrubs—across sub-cells on the terrain, combining multi-distance mesh LODs with **Octahedral Impostors** for
high-speed rendering.

## 1. How It Works & Key Features

- **Sub-Cell Streaming & 32-Byte Mega Buffer**: Mounts only surrounding sub-cells as the camera moves, compressing each
  instance's position, rotation, and scale into 32 bytes inside a unified `FoliageMegaBuffer`.
- **Automatic Octahedral Impostor Baking**: When `useImpostor: true` (default) is enabled, distant vegetation beyond the
  final 3D mesh LOD distance is automatically baked into a multi-angle hemispherical atlas (Albedo + Normal/Depth) and
  rendered as a quad billboard.
- **Terrain Layer & Slope Integration**: Automatically distributes vegetation only in areas matching the specified
  splatting layer (`targetLayer`) and slope constraints (`minSlope` and `maxSlope`).

---

## 2. Registering Foliage Types

Pass a model loaded via `GLTFLoader` or `Mesh` to `landscape.foliageManager.addType(options)` to register a foliage type
(`Foliage`).

```javascript
// Example of loading a glTF tree model and registering it as a foliage type
new RedGPU.GLTFLoader(
    redGPUContext,
    './assets/foliage/pine_tree.glb',
    (loader) => {
        const treeMesh = loader.resultMesh;

        const pineFoliage = landscape.foliageManager.addType({
            name: 'PineTree',
            lods: [
                { mesh: treeMesh, lodDistance: 120 } // 0 ~ 120m: Render original 3D mesh
            ],
            useImpostor: true,          // 120m ~ cullingDistance: Auto-switch to octahedral impostor
            cullingDistance: 1500,      // Maximum visible distance (1500m)
            shadowCullDistance: 150,    // Shadow casting distance (150m)
            densityPerHectare: 150,     // Base density per hectare (100m x 100m)
            targetLayer: 'Grass',       // Distribute proportional to 'Grass' terrain layer weight
            minSlope: 0,
            maxSlope: 35,               // Place only on gentle slopes up to 35 degrees
            minScale: [0.8, 0.8, 0.8],
            maxScale: [1.3, 1.4, 1.3],
            trunkBendScale: 1.0,        // Trunk bending multiplier driven by wind
            leafFlutterScale: 1.0       // Leaf flutter multiplier driven by wind
        });
    }
);
```

---

## 3. `FoliageOptions` Key Properties

| Property                           | Default         | Description                                                                               |
|:-----------------------------------|:----------------|:------------------------------------------------------------------------------------------|
| **`name`**                         | Required        | Unique identifier name for the foliage type                                               |
| **`lods`**                         | Required        | Array of distance-based LOD configurations (`[{ mesh, lodDistance, receiveShadow }]`)     |
| **`useImpostor`**                  | `true`          | Automatically bakes and uses distant Octahedral Impostors                                 |
| **`cullingDistance`**              | `200.0`         | Maximum visible distance from the camera at which instances are rendered                  |
| **`shadowCullDistance`**           | `50.0`          | Maximum distance at which shadows are cast in the shadow pass                             |
| **`castShadow` / `receiveShadow`** | `true` / `true` | Enables shadow casting and receiving                                                      |
| **`densityPerHectare`**            | `1000.0`        | Baseline placement density per hectare (10,000㎡)                                         |
| **`densityMultiplier`**            | `1.0`           | Real-time multiplier applied to the baseline density                                      |
| **`targetLayer`**                  | `''`            | Name or index of the `LandscapeLayer` used to weight placement probability                |
| **`minSlope` / `maxSlope`**        | `0.0` / `45.0`  | Minimum and maximum terrain slope angles allowed for placement (in degrees)               |
| **`minScale` / `maxScale`**        | `[1, 1, 1]`     | Per-instance random scale range `[x, y, z]`                                               |
| **`alignToNormal`**                | `false`         | Rotates instances to align with the terrain surface normal                                |
| **`groundBlendStrength`**          | `1.0`           | Blending strength between the foliage base and terrain surface color/normal (`0.0 ~ 1.0`) |
| **`trunkBendScale`**               | `1.0`           | Trunk bending intensity multiplier reacting to `scene.windManager`                        |
| **`leafFlutterScale`**             | `1.0`           | Leaf flutter intensity multiplier reacting to `scene.windManager`                         |

---

## Next Steps

- **[Procedural Grass](./grass.md)**: High-density grass scattering system covering the terrain surface
