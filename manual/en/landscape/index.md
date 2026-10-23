---
title: Landscape & Ecosystem
order: 12
---

<script setup>
const landscapeGraph = `
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape (16km Open World)"]
        Landscape -->|Tile Streaming| VHT["VHT / VNT Atlas (Virtual Height & Normal)"]
        Landscape -->|8-Layer PBR| Material["LandscapeMaterial & Hybrid VBT"]
        Landscape -->|Scatter| Foliage["FoliageManager (LOD & Octahedral Impostor)"]
        Landscape -->|Scatter| Grass["GrassManager (16m Cell GPU Baking)"]
        VHT --> Culler["Unified GPU Compute Culler (Frustum + HZB)"]
        Culler --> Indirect["Multi-Draw Indirect Rendering"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style VHT fill:#f4d4d8,fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Culler fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Indirect fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Landscape & Ecosystem

RedGPU provides a GPU-driven `Landscape` and **Ecosystem** pipeline designed to render expansive open-world
environments (16km × 16km and beyond) at 60 FPS.

To eliminate CPU bottlenecks, terrain tiles, hundreds of thousands of trees (`Foliage`), and millions of grass blades
(`Grass`) are culled against the view frustum and the Hierarchical Z-Buffer (**HZB**) within a **Unified Compute
Pass**, and rendered via **Indirect Draw**.

<ClientOnly>
  <MermaidResponsive :definition="landscapeGraph" />
</ClientOnly>

## 1. Core Architecture

- **Virtual Height & Normal Texture (VHT/VNT)**: Combines a global heightmap with asynchronous tile streaming around the
  camera to manage massive elevation data in a GPU atlas and bake real-time Central Difference Normals.
- **Continuous Terrain LOD & Skirt**: Selects up to 8 LOD levels based on projected screen size (`screenSize`) or
  distance (`distance`), preventing popping and tile cracks via vertex morphing and boundary skirt geometry.
- **Hybrid Multi-Layer Splatting**: Blends up to 8 PBR layers with **Stochastic Tiling** in real time for near ranges,
  while sampling a pre-baked **Virtual Blend Texture (VBT)** atlas in a single lookup for far distances to save
  bandwidth.
- **Foliage & Octahedral Impostor**: Uses sub-cell streaming and a compressed 32-byte mega buffer, automatically
  transitioning distant vegetation into runtime-baked **Octahedral Impostor** billboards to minimize draw calls.
- **Procedural Grass**: Bakes instances on the fly in GPU compute shaders across 16m cells around the camera and shades
  them using **Two-Sided Foliage PBR** with subsurface scattering.

## 2. Learning Roadmap

1. **[Terrain & Streaming](./terrain.md)** : Initializing `Landscape`, tile streaming, continuous LOD, height queries
   (`getHeightAt`), and self-shadowing
2. **[Multi-Layer Splatting](./material-splatting.md)** : 8-layer PBR texture blending and stochastic tiling with
   `LandscapeMaterial` and `LandscapeLayer`
3. **[Foliage & Impostors](./foliage.md)** : Scattering trees and rocks, multi-level LOD, and octahedral impostors with
   `FoliageManager`
4. **[Procedural Grass](./grass.md)** : High-density vegetation scattering and wind synchronization with `GrassManager`

---

## Related Examples

- [Basic Terrain](/RedGPU/examples/3d/landscape/basicTerrain/)
- [Tile Streaming](/RedGPU/examples/3d/landscape/tileStreaming/)
- [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
- [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [Procedural Grass](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

[Next Step: Learn Terrain & Streaming](./terrain.md)
