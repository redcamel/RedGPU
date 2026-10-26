---
title: Tile Streaming
order: 3
---

# Tile Streaming

Instead of loading high-resolution heightmaps for an entire open-world terrain into memory at once, you can
asynchronously stream only the surrounding tiles needed around the camera in real time (`tileUrlResolver`).

---

## 1. Configuring Global Heightmap & Tile Streaming

Tile streaming operates in a two-tier hierarchy combining a **Global Heightmap (`globalHeightmapUrl`)** and **Individual
High-Resolution Tiles (`tileUrlResolver`)**:

1. **`globalHeightmapUrl` (Distant Macro Base)**: Provides baseline elevation for distant regions (`tileLoadingRadius`
   and beyond) where high-resolution tiles have not yet been loaded.
2. **`tileUrlResolver` (Near High-Resolution Detail)**: When the camera enters `tileLoadingRadius`, high-resolution tile
   heightmaps (16-bit PNG recommended) corresponding to the 16×16 (256) grid coordinates (`row: 0~15`, `col: 0~15`) are
   streamed asynchronously and partially baked into their respective slots in the virtual atlases (VHT/VNT/VBT).

```javascript
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
landscape.heightScale = 300;

// 1. Configure the global heightmap providing baseline elevation for unloaded distant regions
landscape.globalHeightmapUrl = './assets/terrain/global_heightmap_1024.png';

// 2. Asynchronously stream up to 2 tiles per frame within a 1250m radius of the camera
landscape.tileLoadingRadius = 1250;
landscape.tileMaxLoadsPerFrame = 2;

// 3. Callback returning the 16-bit PNG tile URL for each 16x16 grid coordinate (row, col)
landscape.tileUrlResolver = (row, col) => {
    const r = String(row).padStart(2, '0');
    const c = String(col).padStart(2, '0');
    return `./assets/tiles/height_tile_${r}_${c}.png`;
};

scene.landscape = landscape;
```

### Live Example: Tile Streaming

<iframe src="/RedGPU/examples/3d/landscape/tileStreaming/" style="width:100%; height:500px;"></iframe>

---

## 2. Key Tile Streaming Properties & Methods

| Type         | Property / Method            | Default   | Description                                                                                             |
|:-------------|:-----------------------------|:----------|:--------------------------------------------------------------------------------------------------------|
| **Property** | **`tileUrlResolver`**        | `null`    | Callback receiving a tile's `row` and `col` indices and returning its heightmap URL                     |
|              | **`tileLoadingRadius`**      | `2500.0`  | Radius around the camera within which high-resolution tiles are streamed (in world units)               |
|              | **`tileMaxLoadsPerFrame`**   | `1`       | Maximum number of tiles to decode and bake simultaneously per frame to prevent frame spikes             |
|              | **`tileLoadedCount`**        | Read-only | Total number of tiles currently streamed and active                                                     |
| **Method**   | **`isTileLoaded(row, col)`** | -         | Returns whether the high-resolution heightmap for the specified `(row, col)` tile is loaded (`boolean`) |

---

## Related Examples

- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Procedural Grass](./grass.md)
