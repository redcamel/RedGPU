---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape"]
        Landscape --> Terrain["Terrain & Tile Streaming"]
        Landscape --> Material["LandscapeMaterial (8-Layer Splatting)"]
        Landscape --> Foliage["FoliageManager (LOD & Octahedral Impostor)"]
        Landscape --> Grass["GrassManager (GPU Procedural Grass)"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Terrain fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# Landscape & Ecosystem

<img src="/RedGPU/manual/landscape/landscape.jpg" alt="Landscape" style="width:100%; max-height:280px; object-fit:cover; border-radius:8px; margin-bottom:16px;" />

RedGPU provides a GPU-driven **Landscape** (`Landscape`) and **Ecosystem** (`FoliageManager`, `GrassManager`) pipeline
designed to render expansive open-world environments at 60 FPS.

Terrain tiles, hundreds of thousands of trees (`Foliage`), and millions of grass clumps (`Grass`) are culled against the
view frustum and Hierarchical Z-Buffer (**HZB**) in a GPU compute pass and rendered via Indirect Draw.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

---

## Component Overview

| Component                                            | Core Classes                          | Key Features                                                                                                                   |
|:-----------------------------------------------------|:--------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| **[Terrain & Tile Streaming](./terrain.md)**         | `Landscape`                           | Global/tile heightmap streaming, continuous LOD morphing, elevation queries (`getHeightAt`), heightmap raymarched self-shadows |
| **[Multi-Layer Splatting](./material-splatting.md)** | `LandscapeMaterial`, `LandscapeLayer` | Up to 8 PBR layers with weight blending, stochastic tiling (tiling artifact suppression), distant Virtual Blend Texture (VBT)  |
| **[Foliage & Impostors](./foliage.md)**              | `FoliageManager`, `Foliage`           | Sub-cell streaming for trees and rocks, multi-stage mesh LODs, automatic distant Octahedral Impostor transitions               |
| **[Procedural Grass](./grass.md)**                   | `GrassManager`, `Grass`               | Real-time GPU baking in 16m cells around the camera, two-sided foliage PBR with subsurface scattering, ground color blending   |

---

## Related Examples

- [Basic Terrain](/RedGPU/examples/3d/landscape/basicTerrain/)
- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Landscape & Water](/RedGPU/examples/3d/landscape/landscapeAndWater/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Terrain & Streaming](./terrain.md)
