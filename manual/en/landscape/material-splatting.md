---
title: Multi-Layer Splatting
order: 2
---

# Multi-Layer Splatting

`RedGPU.Landscape.LandscapeMaterial` and `RedGPU.Landscape.LandscapeLayer` provide a **Multi-Layer Splatting** system
that blends up to **8 PBR layers** across the terrain surface using weight maps, elevation, and slope.

## 1. Hybrid Rendering Architecture (Near Detail + VBT)

Sampling textures (BaseColor, Normal, ORM) across 8 layers for every pixel on a massive terrain creates severe GPU
texture bandwidth bottlenecks. RedGPU solves this with a **Hybrid VBT** (Virtual Blend Texture) pipeline:

- **Near Range (within `nearDetailDistance`)**: Blends high-resolution PBR layers with **Stochastic Tiling** in real
  time for crisp surface detail.
- **Far Range (beyond `nearDetailDistance`)**: Fetches color with a single sample from the pre-baked **Virtual Blend
  Texture (VBT)** atlas generated during tile streaming, drastically reducing rendering cost.

```javascript
// Set the distance (in world units) within which near high-resolution texture blending is active
landscape.nearDetailDistance = 350;
```

## 2. Adding Splatting Layers (`addLayer`)

Call `landscape.addLayer(options)` to register up to 8 `LandscapeLayer` instances sequentially. The first layer acts as
the base layer, while subsequent layers blend according to the specified channel (`weightChannel`) of their
`weightTexture` (splat map).

```javascript
// 1. Add base Dirt layer
const dirtLayer = landscape.addLayer({
    name: 'Dirt',
    baseColorTexture: './assets/terrain/dirt_diff.ktx2',
    normalTexture: './assets/terrain/dirt_norm.ktx2',
    ormTexture: './assets/terrain/dirt_orm.ktx2',
    uvScale: 40,
    roughnessFactor: 0.85,
    stochasticTiling: true
});

// 2. Add Grass layer (uses R channel: 0 of splat map)
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/terrain/grass_diff.ktx2',
    normalTexture: './assets/terrain/grass_norm.ktx2',
    ormTexture: './assets/terrain/grass_orm.ktx2',
    weightTexture: './assets/terrain/splat_map.png',
    weightChannel: 0, // 0: R, 1: G, 2: B, 3: A
    uvScale: 60,
    roughnessFactor: 0.7,
    stochasticTiling: true
});

// 3. Add Rock layer (uses G channel: 1 of splat map)
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/terrain/rock_diff.ktx2',
    normalTexture: './assets/terrain/rock_norm.ktx2',
    ormTexture: './assets/terrain/rock_orm.ktx2',
    weightTexture: './assets/terrain/splat_map.png',
    weightChannel: 1,
    uvScale: 25,
    normalStrength: 1.4,
    stochasticTiling: true
});
```

## 3. `LandscapeLayerOptions` Key Properties

| Property               | Default   | Description                                                                                   |
|:-----------------------|:----------|:----------------------------------------------------------------------------------------------|
| **`name`**             | `'Layer'` | Unique identifier name for the layer (linked with `targetLayer` in foliage and grass)         |
| **`baseColorTexture`** | `null`    | Base color (Albedo) texture path or `BitmapTexture`                                           |
| **`normalTexture`**    | `null`    | Tangent-space normal map path or `BitmapTexture`                                              |
| **`ormTexture`**       | `null`    | Packed Occlusion (R), Roughness (G), Metallic (B) texture                                     |
| **`weightTexture`**    | `null`    | Splat map texture containing layer distribution weights                                       |
| **`weightChannel`**    | `0`       | Channel index to sample from `weightTexture` (`0`: R, `1`: G, `2`: B, `3`: A)                 |
| **`uvScale`**          | `10.0`    | Texture UV repeat multiplier relative to terrain tiles (`number` or `[u, v]`)                 |
| **`normalStrength`**   | `1.0`     | Normal map bump intensity multiplier                                                          |
| **`roughnessFactor`**  | `0.8`     | Surface roughness factor (`0.0 ~ 1.0`)                                                        |
| **`metallicFactor`**   | `0.0`     | Metallic factor (`0.0 ~ 1.0`)                                                                 |
| **`aoFactor`**         | `1.0`     | Ambient occlusion intensity factor                                                            |
| **`stochasticTiling`** | `false`   | Enables stochastic sampling to eliminate repetitive texture tiling artifacts over large areas |

## 4. Querying and Managing Layers

Registered layers can be queried, modified, or removed by name or instance at any time, automatically recalculating the
VBT atlas and ecosystem weights.

```javascript
// Retrieve a layer by name and update its properties
const layer = landscape.getLayer('Rock');
if (layer) {
    layer.uvScale = 30;
    layer.normalStrength = 1.6;
}

// Remove a specific layer or clear all layers
landscape.removeLayer('Rock');
// landscape.clearLayers();
```

---

## Next Step

Learn how the foliage system scatters tens of thousands of trees and rocks based on terrain layer weights
(`targetLayer`) and slope.

- **[Foliage & Impostors](./foliage.md)**

---

## Related Examples

- [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)
