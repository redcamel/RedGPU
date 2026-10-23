---
title: Multi-Layer Splatting
order: 2
---

# Multi-Layer Splatting

`RedGPU.Landscape.LandscapeMaterial` and `RedGPU.Landscape.LandscapeLayer` provide a **Multi-Layer Splatting** system
that blends up to **8 PBR layers** across the terrain surface using weight maps (`weightTexture`) and height-modulated
blending (`heightBlendFactor`).

---

## 1. Registering Splatting Layers (`addLayer`)

Call `landscape.addLayer(options)` to register up to 8 `LandscapeLayer` instances. The first layer (index 0) also acts
as the base fallback layer, while each layer blends according to its designated channel (`'R' | 'G' | 'B' | 'A'`) in
`weightTexture`.

- **Near Range (within `nearDetailDistance`)**: Blends high-resolution PBR textures with stochastic tiling
  (`stochasticTiling`) in real time.
- **Far Range (beyond `nearDetailDistance`)**: Samples the pre-baked Virtual Blend Texture (VBT) atlas in a single
  lookup to save GPU texture bandwidth.

```javascript
// Set the distance (in world units) within which near high-resolution texture blending is active
landscape.nearDetailDistance = 350;

const weightTexture = './assets/terrain/weightTexture.jpg';

// 1. Add Grass layer (uses 'R' channel of splat map)
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/terrain/layer/grass.jpg',
    normalTexture: './assets/terrain/layer/grass_normal.jpg',
    ormTexture: './assets/terrain/layer/grass_orm.jpg',
    weightTexture,
    weightChannel: 'R',
    uvScale: [25, 25],
    roughness: 0.85,
    stochasticTiling: true
});

// 2. Add Rock layer (uses 'G' channel of splat map)
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/terrain/layer/rock.jpg',
    normalTexture: './assets/terrain/layer/rock_normal.jpg',
    ormTexture: './assets/terrain/layer/rock_orm.jpg',
    weightTexture,
    weightChannel: 'G',
    uvScale: [7.5, 7.5],
    roughness: 0.7,
    normalIntensity: 1.2,
    stochasticTiling: true
});
```

### Live Example: Multi-Layer Splatting

<iframe src="/RedGPU/examples/3d/landscape/multiLayerSplatting/" style="width:100%; height:500px;"></iframe>

---

## 2. `LandscapeLayerOptions` Key Properties

| Category              | Property                                  | Default               | Description                                                                                  |
|:----------------------|:------------------------------------------|:----------------------|:---------------------------------------------------------------------------------------------|
| **Identity & State**  | **`name`**                                | Required              | Unique layer name (linked with `targetLayer` in foliage and grass)                           |
|                       | **`enabled`**                             | `true`                | Whether the layer is enabled                                                                 |
| **Textures & Weight** | **`baseColorTexture`**                    | `undefined`           | Base color (Albedo) texture path or `BitmapTexture`                                          |
|                       | **`normalTexture`**                       | `undefined`           | Tangent-space normal map path or `BitmapTexture`                                             |
|                       | **`ormTexture`**                          | `undefined`           | Packed Occlusion (R), Roughness (G), Metallic (B), Height (A) texture                        |
|                       | **`weightTexture`**                       | `undefined`           | Splat map texture containing layer distribution weights                                      |
|                       | **`weightChannel`**                       | `'R'`                 | Channel to sample from `weightTexture` (`'R' \| 'G' \| 'B' \| 'A'` or `0 ~ 3`)               |
| **UV & Tiling**       | **`uvScale`** / **`uvOffset`**            | `[20, 20]` / `[0, 0]` | Texture UV repeat scale `[u, v]` per tile and UV offset `[u, v]`                             |
|                       | **`nearUVScaleMultiplier`**               | `2.0`                 | UV scale multiplier applied to the near-detail region                                        |
|                       | **`stochasticTiling`**                    | `true`                | Enables stochastic sampling to suppress repetitive texture tiling artifacts over large areas |
|                       | **`stochasticScale`**                     | `1.0`                 | Stochastic tiling cell scale (`0.01` or higher)                                              |
| **PBR & Blending**    | **`roughness`**                           | `1.0`                 | Surface roughness factor                                                                     |
|                       | **`normalIntensity`** / **`aoIntensity`** | `1.0` / `1.0`         | Normal map bump intensity and ambient occlusion (AO) intensity                               |
|                       | **`heightBlendFactor`**                   | `1.0`                 | Height-based layer boundary blending contrast factor using ORM alpha (`0.0 ~ 5.0`)           |

---

## 3. Querying and Managing Layers

Registered layers can be queried, modified, or removed by name or instance at any time, automatically updating the VBT
atlas and ecosystem weights.

```javascript
// Retrieve a layer by name and update its properties
const layer = landscape.getLayer('Rock');
if (layer) {
    layer.uvScale = [15, 15];
    layer.heightBlendFactor = 1.5;
}

// Remove a specific layer or clear all layers
landscape.removeLayer('Rock');
// landscape.clearLayers();
```

---

## Related Examples

- [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Foliage & Impostors](./foliage.md)
