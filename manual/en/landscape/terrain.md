---
title: Terrain & Streaming
order: 1
---

# Terrain & Streaming

The `RedGPU.Landscape.Landscape` class manages the spatial grid of large-scale terrain, Virtual Height Texture (**VHT**)
tile streaming, continuous LOD morphing, elevation queries, and the terrain debugger.

## 1. Creating Terrain and Registering to Scene

Create a `Landscape` instance and assign it to `scene.landscape` to integrate it directly into the scene rendering
pipeline.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create a 4000m x 4000m terrain (single number or [width, depth] array)
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);

// 2. Configure global heightmap URL and maximum elevation scale (in meters)
landscape.globalHeightmapUrl = 'https://redcamel.github.io/RedGPU/examples/assets/landscape/heightmap.png';
landscape.heightScale = 600;

// 3. Register terrain to the Scene
scene.landscape = landscape;
```

## 2. Tile Streaming and Resolution Control

Instead of loading high-resolution heightmaps for an entire open world at once, you can asynchronously stream only the
tiles needed around the camera as it moves.

- **`globalHeightmapUrl`**: Path to the global heightmap image providing baseline elevation across the entire terrain.
- **`tileUrlResolver`**: Callback function receiving a tile's `row` and `col` indices and returning the URL for its
  high-resolution tile heightmap.
- **`tileLoadingRadius`**: Radius around the camera within which high-resolution tiles are streamed (default: `2500.0`).
- **`tileMaxLoadsPerFrame`**: Maximum number of tiles to decode and bake per frame to prevent frame spikes.

```javascript
// Asynchronously stream up to 2 tiles per frame within a 3000m radius of the camera
landscape.tileLoadingRadius = 3000;
landscape.tileMaxLoadsPerFrame = 2;

landscape.tileUrlResolver = (row, col) => {
    return `./assets/tiles/height_r${row}_c${col}.png`;
};
```

## 3. Continuous LOD and Shadow Settings

Terrain tiles determine visibility and LOD levels in a GPU compute pass by referencing the view frustum and `View3D`'s
Hierarchical Z-Buffer (**HZB**).

| Property                      | Default        | Description                                                                          |
|:------------------------------|:---------------|:-------------------------------------------------------------------------------------|
| **`worldSize`**               | `[2000, 2000]` | Total world width and depth of the terrain (`number` or `[sizeX, sizeZ]`)            |
| **`componentCount`**          | `[16, 16]`     | Number of tile components dividing the terrain along the X/Z axes                    |
| **`heightScale`**             | `200.0`        | Maximum elevation scale multiplied against normalized heightmap values (`0.0 ~ 1.0`) |
| **`lodMetric`**               | `'screenSize'` | LOD selection metric (`'screenSize'` projected screen ratio / `'distance'` distance) |
| **`lodMaxLevel`**             | `5`            | Maximum number of LOD levels used for terrain meshes (`1 ~ 8`)                       |
| **`receiveShadow`**           | `true`         | Whether the terrain receives CSM shadows from `DirectionalLight`                     |
| **`castHeightmapShadow`**     | `false`        | Enables distant terrain self-shadowing based on heightmap raymarching                |
| **`heightmapShadowDistance`** | `1000.0`       | Maximum raymarching trace distance for heightmap self-shadows (`10.0` or higher)     |
| **`heightmapShadowSteps`**    | `16`           | Number of raymarching sample steps for heightmap self-shadows (`4 ~ 64`)             |
| **`heightmapShadowSoftness`** | `8.0`          | Softness factor for heightmap self-shadow edges (`0.1` or higher)                    |

```javascript
// Enable heightmap raymarched self-shadows cast by distant mountains onto valleys
landscape.castHeightmapShadow = true;
landscape.heightmapShadowDistance = 1500;
landscape.heightmapShadowSteps = 24;
landscape.heightmapShadowSoftness = 8.0;
```

## 4. Querying Terrain Elevation (`getHeightAt`)

Use `landscape.getHeightAt(x, z)` to place characters or standard `Mesh` objects accurately on the terrain surface. It
returns the interpolated world Y coordinate from the CPU heightmap cache.

```javascript
// Query the terrain surface height (Y) at world coordinates (x: 120, z: -45)
const groundY = landscape.getHeightAt(120, -45);
characterMesh.y = groundY;
```

## 5. Terrain Debugger (`LandscapeDebuggerManager`)

Use `landscape.debuggerManager` to visually inspect the terrain wireframe or LOD distribution.

```javascript
// Enable wireframe and per-LOD color visualization
landscape.debuggerManager.landscapeWireframe = true;
landscape.debuggerManager.landscapeLodColoration = true;
```

---

## Next Step

Once the terrain geometry and elevation are configured, learn how to apply multi-layer PBR materials such as rock, dirt,
and grass using the splatting system.

- **[Multi-Layer Splatting](./material-splatting.md)**

---

## Related Examples

- [Basic Terrain](/RedGPU/examples/3d/landscape/basicTerrain/)
- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Landscape & Water Integration](/RedGPU/examples/3d/landscape/landscapeAndWater/)
