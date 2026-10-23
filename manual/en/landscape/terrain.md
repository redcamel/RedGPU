---
title: Terrain & Streaming
order: 1
---

# Terrain & Streaming

The `RedGPU.Landscape.Landscape` class manages the spatial grid of large-scale terrain, heightmap tile streaming,
continuous LOD morphing, elevation queries (`getHeightAt`), and the terrain debugger.

---

## 1. Terrain Creation & Global Heightmap (`globalHeightmapUrl`)

Create a `Landscape` instance, configure `globalHeightmapUrl` and `heightScale`, and assign it to `scene.landscape` to
render the terrain.

### Role of the Global Heightmap (`globalHeightmapUrl`)

- **Standalone Terrain & Distant Macro Base**: A single `globalHeightmapUrl` is sufficient to render the entire terrain
  on its own. When combined with tile streaming, it serves as the baseline elevation (fallback) for distant regions
  where high-resolution tiles have not yet been streamed.
- **16-Bit PNG Precision Support**: Natively parses **16-bit grayscale PNGs (65,536 levels)** to produce smooth slopes
  without the stair-stepping (terracing) artifacts typical of 8-bit images (256 levels).
- **Immediate Elevation Queries & Ecosystem Sync**: Upon loading, it is baked into the GPU virtual height/normal atlases
  and cached on the CPU, enabling `getHeightAt(x, z)` elevation queries as well as `Foliage` and `Grass` placement
  across the entire world immediately.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create a 4000m x 4000m terrain (single number or [width, depth] array)
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);

// 2. Configure global heightmap (16-bit PNG recommended) and maximum elevation scale (in meters)
landscape.globalHeightmapUrl = './assets/terrain/global_heightmap_1024.png';
landscape.heightScale = 300;

// 3. Register terrain to the Scene
scene.landscape = landscape;
```

### Live Example: Basic Terrain

<iframe src="/RedGPU/examples/3d/landscape/basicTerrain/" style="width:100%; height:500px;"></iframe>

---

## 2. Tile Streaming (`tileUrlResolver`)

Instead of loading high-resolution heightmaps for an entire open world at once, you can asynchronously stream only the
tiles needed around the camera as it moves.

```javascript
// Asynchronously stream up to 2 high-resolution tiles per frame within a 1250m radius of the camera
landscape.tileLoadingRadius = 1250;
landscape.tileMaxLoadsPerFrame = 2;

landscape.tileUrlResolver = (row, col) => {
    const r = String(row).padStart(2, '0');
    const c = String(col).padStart(2, '0');
    return `./assets/tiles/height_tile_${r}_${c}.png`;
};
```

### Live Example: Tile Streaming

<iframe src="/RedGPU/examples/3d/landscape/tileStreaming/" style="width:100%; height:500px;"></iframe>

---

## 3. Key Configuration Properties

| Category             | Property                                                   | Default        | Description                                                                          |
|:---------------------|:-----------------------------------------------------------|:---------------|:-------------------------------------------------------------------------------------|
| **Size & Elevation** | **`worldSize`**                                            | `[2000, 2000]` | Total world width and depth of the terrain (`number` or `[sizeX, sizeZ]`)            |
|                      | **`heightScale`**                                          | `200.0`        | Maximum elevation scale multiplied against normalized heightmap values (`0.0 ~ 1.0`) |
|                      | **`globalHeightmapUrl`**                                   | `null`         | Path to the global heightmap image providing baseline elevation across the terrain   |
| **Tile Streaming**   | **`tileUrlResolver`**                                      | `null`         | Callback returning the high-resolution heightmap URL for a given tile (`row`, `col`) |
|                      | **`tileLoadingRadius`**                                    | `2500.0`       | Streaming radius around the camera for high-resolution tiles                         |
|                      | **`tileMaxLoadsPerFrame`**                                 | `2`            | Maximum number of tiles to decode and bake simultaneously per frame                  |
| **LOD**              | **`lodMetric`**                                            | `'screenSize'` | LOD selection metric (`'screenSize'` projected screen ratio / `'distance'` distance) |
|                      | **`lodMaxLevel`**                                          | `5`            | Maximum number of LOD levels used for terrain meshes (`1 ~ 8`)                       |
|                      | **`componentSizeQuads`** / **`lod0SizeQuads`**             | `64` / `256`   | Tile component grid resolution and LOD 0 quad resolution                             |
| **Shadows**          | **`receiveShadow`**                                        | `true`         | Whether the terrain receives CSM shadows from `DirectionalLight`                     |
|                      | **`castHeightmapShadow`**                                  | `false`        | Enables distant terrain self-shadowing based on heightmap raymarching                |
|                      | **`heightmapShadowDistance`**                              | `1000.0`       | Maximum raymarching trace distance for heightmap self-shadows (`10.0` or higher)     |
|                      | **`heightmapShadowSteps`** / **`heightmapShadowSoftness`** | `16` / `8.0`   | Raymarching sample step count (`4 ~ 64`) and edge softness factor                    |

---

## 4. Querying Terrain Elevation (`getHeightAt`) & Debugger

Use `landscape.getHeightAt(x, z)` to place characters or standard `Mesh` objects on the terrain surface, and
`landscape.debuggerManager` to visually inspect the wireframe and LOD distribution.

```javascript
// 1. Query the terrain surface height (Y) at world coordinates (x, z)
characterMesh.y = landscape.getHeightAt(characterMesh.x, characterMesh.z);

// 2. Enable wireframe and per-LOD color visualization
landscape.debuggerManager.landscapeWireframe = true;
landscape.debuggerManager.landscapeLodColoration = true;
```

---

## Related Examples

- [Basic Terrain](/RedGPU/examples/3d/landscape/basicTerrain/)
- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Landscape & Water](/RedGPU/examples/3d/landscape/landscapeAndWater/)

---

[Next Step: Learn Multi-Layer Splatting](./material-splatting.md)
