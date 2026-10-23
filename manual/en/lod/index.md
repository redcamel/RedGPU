---
title: LOD
order: 10
---

# LOD

**LOD** (Level of Detail) is an optimization technique that switches between geometries with different vertex counts
based on the distance between the camera and the object. RedGPU embeds `LODManager` in both `Mesh` and `InstancingMesh`
to manage distance-based models through a unified interface.

## 1. LOD Method Comparison by Object Type

| Type                                          | Target Class     | Distance Evaluation | Characteristics                                                                               |
|:----------------------------------------------|:-----------------|:--------------------|:----------------------------------------------------------------------------------------------|
| **[Mesh LOD](./mesh-lod.md)**                 | `Mesh`           | CPU                 | Evaluates camera distance per frame on the CPU and swaps the target geometry                  |
| **[Instancing Mesh LOD](./instanced-lod.md)** | `InstancingMesh` | GPU Shader          | Evaluates per-instance camera distances in parallel on the GPU and renders via sub-draw calls |

---

## Next Steps

- **[Mesh LOD](./mesh-lod.md)**: Applying distance-based LOD to single meshes
- **[Instancing Mesh LOD](./instanced-lod.md)**: Applying GPU-driven LOD to massive instanced meshes
