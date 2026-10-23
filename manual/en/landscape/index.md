---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape"]
        Landscape --> Terrain["1. Terrain (Global Heightmap & LOD)"]
        Landscape --> Material["2. Multi-Layer Splatting (LandscapeMaterial)"]
        Landscape --> Streaming["3. Tile Streaming (On-Demand Tiles)"]
        Landscape --> Grass["4. Procedural Grass (GrassManager)"]
        Landscape --> Foliage["5. Foliage & Impostors (FoliageManager)"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Terrain fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Streaming fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# Landscape & Ecosystem

<img src="/RedGPU/manual/landscape/landscape.jpg" alt="Landscape" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:16px;" />

RedGPU provides a GPU-driven **Landscape** (`Landscape`) and **Ecosystem** (`GrassManager`, `FoliageManager`) pipeline
designed to render expansive open-world environments at 60 FPS.

Terrain tiles, millions of grass clumps (`Grass`), and hundreds of thousands of trees (`Foliage`) are culled against the
view frustum and Hierarchical Z-Buffer (**HZB**) in a GPU compute pass and rendered via Indirect Draw.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

---

## Component Overview

| Order | Component                                            | Core Classes                          | Key Features                                                                                                                         |
|:-----:|:-----------------------------------------------------|:--------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| **1** | **[Terrain](./terrain.md)**                          | `Landscape`                           | Global heightmap (16-bit PNG support), continuous LOD morphing, elevation queries (`getHeightAt`), heightmap raymarched self-shadows |
| **2** | **[Multi-Layer Splatting](./material-splatting.md)** | `LandscapeMaterial`, `LandscapeLayer` | Up to 8 PBR layers blended via a single shared RGBA weight map, stochastic tiling, distant Virtual Blend Texture (VBT)               |
| **3** | **[Tile Streaming](./tile-streaming.md)**            | `LandscapeTileStreamer`               | On-demand asynchronous 16-bit tile streaming (`tileUrlResolver`) based on camera proximity (`tileLoadingRadius`)                     |
| **4** | **[Procedural Grass](./grass.md)**                   | `GrassManager`, `Grass`               | Real-time GPU baking in 16m cells around the camera, two-sided foliage PBR with subsurface scattering, ground color blending         |
| **5** | **[Foliage & Impostors](./foliage.md)**              | `FoliageManager`, `Foliage`           | Sub-cell streaming for trees and rocks, multi-stage mesh LODs, automatic distant Octahedral Impostor transitions                     |

---

## Related Examples

- [Basic Terrain](/RedGPU/examples/3d/landscape/basicTerrain/)
- [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [Landscape & Water](/RedGPU/examples/3d/landscape/landscapeAndWater/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Terrain](./terrain.md)
